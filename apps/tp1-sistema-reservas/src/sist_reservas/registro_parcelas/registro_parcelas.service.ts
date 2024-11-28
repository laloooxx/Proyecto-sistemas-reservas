import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EstadoParcela, handleServiceError } from '../../common';
import { formatPage, formatTake, MAX_TAKE_PER_QUERY } from '../../common/paginationHelper';
import { PaginatorDto } from '../../common/paginatorDto';
import { Metadata, PaginatorRegistroParcelas } from '../../common/types';
import { MAILER_SERVICE, USUARIO_SERVICE } from '../../config';
import { ParcelasEntity } from '../parcelas/entity/parcelas.entity';
import { Registro_parcelasEntity } from './entity/regist_parc_entity';
import { Registro_parcelasDto } from './entity/regist_parcDto';

   
interface RegistroSalidaResponse extends Registro_parcelasDto {
  message: string;
  precio_total: number;
}

@Injectable()
export class RegistroParcelasService {
  constructor(
    @InjectRepository(Registro_parcelasEntity)
    private readonly registroParcelaRepository: Repository<Registro_parcelasEntity>,
    @InjectRepository(ParcelasEntity)
    private readonly parcelaRepository: Repository<ParcelasEntity>,
    @Inject(MAILER_SERVICE)
    private readonly mailerService: ClientProxy,
    @Inject(USUARIO_SERVICE)
    private readonly usuarioClient: ClientProxy,

  ) {
 
  }

  private readonly logger = new Logger('RegistroServiceLogger');
  

  /**
   * @description va a marcar el ingreso de una parcela 
   * @param id_parcela id de la parcela 
   * @param registroIngreso los datos el registro de ingreso 
   * @returns el nuevo registro de la parcela
   */
  async registrarIngreso(registroIngreso: Registro_parcelasDto, id_parcela: number, id_usuario: number, usuario?: any ){
    try {

      if (!registroIngreso) {
        throw new RpcException('Datos inválidos');
      }

      if (!id_parcela) {
        throw new RpcException('parcela no encontrado');
    }

      //verificamos q la parcela este disponible
      const parcela = await this.parcelaRepository.findOne({
        where: {
          id_parcela
        }
      });
      if (!parcela) {
        throw new RpcException("La parcela no esta disponible");
      }

      if (parcela.estado_parcela === EstadoParcela.OCUPADA) {
        throw new RpcException('La parcela esta ocupada')
      }

      //comprobamos q l fecha de salida sea mayor q a la de ingreso
      if (registroIngreso.f_salida <= registroIngreso.f_ingreso) {
        throw new RpcException('La fecha de salida no puede ser anterior o igual a la fecha de ingreso');
      }

      const parcelaExistente = await this.registroParcelaRepository.findOne({
        where: {
            parcela: { id_parcela },
            //buscamos reservas cuyo campo "desde" sea menor o igual a reservaDto.hasta (la fecha de fin de la nueva reserva).Usamos dos nodos para determinar si el primero es menor o igual que el segundo
            f_ingreso: LessThanOrEqual(registroIngreso.f_salida),
            f_salida: MoreThanOrEqual(registroIngreso.f_ingreso)
        }
    });

    if (parcelaExistente) {
      new RpcException('La parcela no está disponible para las fechas solicitadas');
    }

      const codigoUnico = uuidv4().split('-')[0];


      const newRegistro = this.registroParcelaRepository.create({
        ...registroIngreso,
        parcela: parcela,
        id_usuario,
        codigo_unico_parcela: codigoUnico,
        precio_total_parc: 0
      });

      parcela.estado_parcela = EstadoParcela.OCUPADA;
      await this.parcelaRepository.save(parcela);

      this.logger.log(`Registro de parcela creada exitosamente para el departamento ID: ${id_parcela} por el usuario ID: ${id_usuario}`);


      return await this.registroParcelaRepository.save(newRegistro);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(
        error.message || 'Ocurrió un error inesperado en el servicio'
      );
    }
  }


  /**
   * @description marcamos la salida de de un usuario de la parcela para dejarla libre
   * @param codigo_unico_parcela codigo unico del registro de la parcela
   * @returns el registro de la parcela actualizado 
   */
  async registrarSalida(codigo_unico_parcela: string, id_usuario: number): Promise<RegistroSalidaResponse> {

    try {
      //buscamos el reigstro de la parcela
      const registro = await this.registroParcelaRepository.findOne({ where: { codigo_unico_parcela } });

      if (!registro) {
        throw new RpcException('Registro no enccontrado o ya finalizado')
      };

      //calculamos el precio total
      const precioTotal = await this.calcularPrecioTotal(registro.id_reg_parcela, registro.f_ingreso, registro.f_salida);
      //Actualizamos el registro con el precio total
      registro.precio_total_parc = precioTotal;

      const parcela = await this.parcelaRepository.findOne({ where: { id_parcela: registro.id_reg_parcela }});

      if (!parcela) {
        throw new RpcException('parcela no encontrada');
      }

      parcela.estado_parcela = EstadoParcela.DISPONIBLE;
      await this.parcelaRepository.save(parcela);

      await this.registroParcelaRepository.save(registro);

      return {
        ...registro,
        message: 'Registro finalizado correctamente',
        precio_total: precioTotal,
      };

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
    //extraemos el precio base del departamento, si viene null o undefined, lo seteamos en 0
    const precio_base_parcela = parcela.precio_base_parc || 0;
    this.logger.log("el precio base d la parcela", precio_base_parcela);
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


  /**
 * @description Elimina un registro de parcela por su código único.
 * @param codigoUnicoParcela El código único del registro que se desea eliminar.
 * @returns Mensaje de éxito o error si no se encuentra el registro.
 */
  async eliminarRegistroPorCodigoUnico(codigo_unico_parcela: string): Promise<string> {
    try {
      const resultado = await this.registroParcelaRepository.delete({ codigo_unico_parcela: codigo_unico_parcela });

      if (resultado.affected === 0) {
        throw new RpcException('Registro no encontrado');
      }

      return 'Registro eliminado exitosamente';
    } catch (error) {
      handleServiceError(error);
    }
  }
}