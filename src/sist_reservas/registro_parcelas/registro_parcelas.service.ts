import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Registro_parcelasEntity } from './entity/regist_parc_entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Registro_parcelasDto } from './entity/regist_parcDto';
import { ParcelasEntity } from '../parcelas/entity/parcelas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoParcela } from 'src/common';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';

@Injectable()
export class RegistroParcelasService {
  constructor(
    @InjectRepository(Registro_parcelasEntity)
    private readonly registroParcelaRepository: Repository<Registro_parcelasDto>,
    @InjectRepository(ParcelasEntity)
    private readonly parcelaRepository: Repository<ParcelasEntity>
  ) {}

  async registrarIngreso(registroIngreso: Registro_parcelasDto): Promise<Registro_parcelasDto> {
    try {
      //verificamos q la parcela este disponible
      const parcela = await this.parcelaRepository.findOne({
        where: {
          id_parcela: registroIngreso.id_reg_parc
        }
      });
      if (!parcela || parcela.estado_parcela === EstadoParcela.OCUPADA) {
        throw new HttpException("La parcela no esta disponible",404);
      }

      const newRegistro = this.registroParcelaRepository.create({
        ...Registro_parcelasDto,
        f_ingreso: new Date()
      });

      parcela.estado_parcela = EstadoParcela.OCUPADA;
      await this.parcelaRepository.save(parcela);

      return await this.registroParcelaRepository.save(newRegistro);
    } catch (error) {
      console.error("Error en el servicio de registro de parcelas", error);
            if (error instanceof QueryFailedError)
                throw new HttpException(`${error.name} ${error.driverError}`, 404)
            throw new HttpException(error.message, error.status)
    }
  }


  async registrarSalida(id_reg_parc: number): Promise<Registro_parcelasDto> {

    try {
      //buscamos el reigstro de la parcela
    const registro = await this.registroParcelaRepository.findOne({ where: { id_reg_parc }});
    if (!registro || registro.f_salida) {
      throw new NotFoundException('Registro no enccontrado o ya finalizado')
    };

    //calculamos el precio total
    const precioTotal = await this.calcularPrecioTotal(registro.id_reg_parc, registro.f_ingreso, registro.f_salida);

    //Actualizamos el registro con la fecha de salida y precio total
    registro.f_salida = new Date();
    registro.precio_total_parc = precioTotal;

    const parcela = await this.parcelaRepository.findOne({where: {id_parcela: registro.id_reg_parc}});
    if (!parcela) {
      throw new NotFoundException('parcela no encontrada');
    }
    parcela.estado_parcela = EstadoParcela.DISPONIBLE;
    await this.parcelaRepository.save(parcela);

    return this.registroParcelaRepository.save(registro)  
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-lanzamos el NotFoundException
      }
      console.error('Error en registrarSalida:', error);
      throw new InternalServerErrorException('Error al registrar la salida');
    }
  }


  async calcularPrecioTotal(id_reg_parc: number, f_ingreso: Date, f_salida: Date): Promise<number> {
    const parcela = await this.parcelaRepository.findOne({ where: { id_parcela: id_reg_parc } });
    if (!parcela) {
        throw new Error('El departamento no existe');
    }

    //extraemos el precio base del departamento, si viene null o undefined, lo seteamos en 0
    const precio_base_parcela = parcela.precio_base_parc || 0;
    console.log("el precio base d la parcela", precio_base_parcela);
    //calculamos la cantidad de dias entre las fechas
    const dias = differenceInCalendarDays(f_ingreso, f_salida);
  
    //calculamos el precio total, multiplicando el precio base por el numero de dias q se va a qeudar en el lugar
    const precio_total = precio_base_parcela * dias;
    return precio_total;
}
}
/**
  
      // 2. Crear registro de ingreso
      const nuevoRegistro = this.registroParcelaRepository.create({
        ...createRegistroDto,
        fechaIngreso: new Date()
      });
  
      // 3. Actualizar estado de la parcela
      parcela.estado = EstadoParcela.OCUPADA;
      await this.parcelaRepository.save(parcela);
  
      return this.registroParcelaRepository.save(nuevoRegistro);
    }
  
    async registrarSalida(registroId: string): Promise<RegistroParcela> {
      // 1. Buscar el registro
      const registro = await this.registroParcelaRepository.findOne(registroId);
      if (!registro || registro.fechaSalida) {
        throw new NotFoundException('Registro no encontrado o ya finalizado');
      }
  
      // 2. Calcular precio total
      const precioTotal = await this.calcularPrecioTotal(registro);
  
      // 3. Actualizar registro con fecha de salida y precio total
      registro.fechaSalida = new Date();
      registro.precioTotal = precioTotal;
  
      // 4. Actualizar estado de la parcela
      const parcela = await this.parcelaRepository.findOne(registro.parcelaId);
      parcela.estado = EstadoParcela.LIBRE;
      await this.parcelaRepository.save(parcela);
  
      return this.registroParcelaRepository.save(registro);
    }
}
 */