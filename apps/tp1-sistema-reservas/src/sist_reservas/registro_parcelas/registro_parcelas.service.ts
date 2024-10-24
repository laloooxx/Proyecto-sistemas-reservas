import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EstadoParcela, handleServiceError } from '../../common';
import { formatPage, formatTake, MAX_TAKE_PER_QUERY } from '../../common/paginationHelper';
import { PaginatorDto } from '../../common/paginatorDto';
import { Metadata, PaginatorRegistroParcelas } from '../../common/types';
import { ParcelasEntity } from '../parcelas/entity/parcelas.entity';
import { Registro_parcelasEntity } from './entity/regist_parc_entity';
import { Registro_parcelasDto } from './entity/regist_parcDto';



@Injectable()
export class RegistroParcelasService {
  constructor(
    @InjectRepository(Registro_parcelasEntity)
    private readonly registroParcelaRepository: Repository<Registro_parcelasEntity>,
    @InjectRepository(ParcelasEntity)
    private readonly parcelaRepository: Repository<ParcelasEntity>
  ) { }

  /**
   * @description va a marcar el ingreso de una parcela 
   * @param id_parcela id de la parcela 
   * @param registroIngreso los datos el registro de ingreso 
   * @returns el nuevo registro de la parcela
   */
  async registrarIngreso(registroIngreso: Registro_parcelasDto, id_parcela: number) {
    try {
      //verificamos q la parcela este disponible
      const parcela = await this.parcelaRepository.findOne({
        where: {
          id_parcela: id_parcela
        }
      });
      if (!parcela) {
        throw new NotFoundException("La parcela no esta disponible");
      }

      if (parcela.estado_parcela === EstadoParcela.OCUPADA) {
        throw new BadRequestException('La parcela esta ocupada')
      }


      const codigoUnico = uuidv4().split('-')[0];


      const newRegistro = this.registroParcelaRepository.create({
        ...registroIngreso,
        f_ingreso: new Date(),
        codigo_unico_parcela: codigoUnico
      });

      parcela.estado_parcela = EstadoParcela.OCUPADA;
      await this.parcelaRepository.save(parcela);

      return await this.registroParcelaRepository.save(newRegistro);
    } catch (error) {
      handleServiceError(error);
    }
  }


  /**
   * @description marcamos la salida de de un usuario de la parcela para dejarla libre
   * @param codigo_unico_parcela codigo unico del registro de la parcela
   * @returns el registro de la parcela actualizado 
   */
  async registrarSalida( codigo_unico_parcela: string): Promise<Registro_parcelasDto> {

    try {
      //buscamos el reigstro de la parcela
      const registro = await this.registroParcelaRepository.findOne({ where: { codigo_unico_parcela } });
      if (!registro || registro.f_salida) {
        throw new NotFoundException('Registro no enccontrado o ya finalizado')
      };

      //Actualizamos el registro con la fecha de salida
      registro.f_salida = new Date();

      //calculamos el precio total
      const precioTotal = await this.calcularPrecioTotal(registro.id_reg_parcela, registro.f_ingreso, registro.f_salida);
      //Actualizamos el registro con el precio total
      registro.precio_total_parc = precioTotal;

      const parcela = await this.parcelaRepository.findOne({ where: { id_parcela: registro.id_reg_parcela } });
      if (!parcela) {
        throw new NotFoundException('parcela no encontrada');
      }
      parcela.estado_parcela = EstadoParcela.DISPONIBLE;
      await this.parcelaRepository.save(parcela);

      return this.registroParcelaRepository.save(registro)
    } catch (error) {
      handleServiceError(error);
    }
  }

/**
 * @description calcula el precio total de la parcela
 * @param id_reg_parc el id del registro de la parcela
 * @param f_ingreso la fecha de ingreso a la parcela
 * @param f_salida la fecha de salida a la parcela
 * @returns el precio total de la parcela
 */
  async calcularPrecioTotal(id_reg_parc: number, f_ingreso: Date, f_salida: Date): Promise<number> {
    const parcela = await this.parcelaRepository.findOne({ where: { id_parcela: id_reg_parc } });
    if (!parcela) {
      throw new Error('El departamento no existe');
    }

    //comprobamos q l fecha de salida sea mayor q a la de ingreso
    if (f_salida <= f_ingreso) {
      throw new Error('La fecha de salida no puede ser anterior o igual a la fecha de ingreso');
    }

    //extraemos el precio base del departamento, si viene null o undefined, lo seteamos en 0
    const precio_base_parcela = parcela.precio_base_parc || 0;
    console.log("el precio base d la parcela", precio_base_parcela);
    //calculamos la cantidad de dias entre las fechas
    const dias = differenceInCalendarDays(f_salida, f_ingreso);

    //calculamos el precio total, multiplicando el precio base por el numero de dias q se va a qeudar en el lugar
    const precio_total = precio_base_parcela * dias;
    return precio_total;
  }


  /**
   * @description muestra los registros de las parcelas
   * @returns todos los registros
   */
  async mostrarRegistrosParcelas(query: PaginatorDto): Promise<PaginatorRegistroParcelas> {
    try {
      //determina cuantos elemntos traer, usa formatTake para asegurar un valor valido
      const take = formatTake(query.take || MAX_TAKE_PER_QUERY.toString())
      //determina q pagina traer, usa formatPage para asegurar un valor valido
      const page = formatPage(query.page || '1');
      //calcula cuantos elemenntos saltear basado en la pagina y en el numero de elements x pagina
      const skip = (page - 1) * take;


      //creamos la consulta sql
      const queryBuilder = this.registroParcelaRepository.createQueryBuilder('user');
      //usamos el query.search, asi q usamos el where para filtrar x nombre
      if (query.search) {
          queryBuilder.where(
              //la busqueda es case-insensitive gracias al lower
              'LOWER(user.nombre) LIKE LOWER(:search)', { search: `%${query.search}%` }
          )
      }

      //ejecutamos la consulta
      const [rows, count] = await queryBuilder
          //limitamos el numero de resultados
          .take(take)
          //salteamos los resultados de las paginas anteriores
          .skip(skip)
          //ejecutamos la consulta y devolvemos tanto los resultados como el conteo total
          .getManyAndCount()

      //calculamos el total de paginas dividiendo el total de items por los items x pagina
      const totalPages = Math.ceil(count / take);
      //y determinamos si hay una pagina siguiente
      const nextPage = page < totalPages ? page + 1 : null;

      //creamos un objeto con toda laa informacion de la paginacion 
      const metadata: Metadata = {
          itemsPerPage: take,
          totalPages,
          totalItems: count,
          currentPage: page,
          nextPage,
          searchTerm: query.search || ''
      }

      //y devolvemos los resultados (rows) y los metadatos
      return { rows, metadata }
    } catch (error) {
      handleServiceError(error);
    }
  }
}