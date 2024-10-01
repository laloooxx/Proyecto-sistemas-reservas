import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, QueryFailedError, Repository } from 'typeorm';
import { ReservasDeptoDto } from './entity/reservas_deptoDto';
import { DepartamentoDto } from '../departamentos/entity/departamentoDto';
import { EstadoReserva } from 'src/common';
import { differenceInCalendarDays } from 'date-fns';
import { ReservasDeptoEntity } from './entity/reservas_depto_entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartamentosEntity } from '../departamentos/entity/departamentos.entity';

@Injectable()
export class ReservasDeptoService {
    constructor(
        @InjectRepository(ReservasDeptoEntity)
        private readonly reservasService: Repository<ReservasDeptoDto>,
        @InjectRepository(DepartamentosEntity)
        private readonly deptoService: Repository<DepartamentoDto>
    ) { }

    /**
     * @description Crea una nueva reserva de un departamento.
     * @param reservaDto
     * @returns La reserva creada
     */
    async crearReserva(reservaDto: ReservasDeptoDto): Promise<ReservasDeptoDto> {
        try {
            // Verificar si el departamento existe
            const depto = await this.deptoService.findOne({ 
                where: 
                { id: reservaDto.id_depto } 
                });
            if (!depto) {
                throw new Error('El departamento no existe');
            }

            // Verificar si el departamento está disponible para las fechas solicitadas
            const reservaExistente = await this.reservasService.findOne({
                where: {
                    id_depto: reservaDto.id_depto,
                    //buscamos reservas cuyo campo "desde" sea menor o igual a reservaDto.hasta (la fecha de fin de la nueva reserva).Usamos dos nodos para determinar si el primero es menor o igual que el segundo
                    desde: LessThanOrEqual(reservaDto.hasta),
                    hasta: MoreThanOrEqual(reservaDto.desde)
                }
            });

            //Si el depto tiene reservas lo almacenamos en la variable reservasExistentes y devolvemos un error
            if (reservaExistente) {
                throw new NotFoundException('El departamento no está disponible para las fechas solicitadas');
            }

            //calculamos el precio total del departamento para las fechas de la reserva
            const precio_total_depto = await this.calcularPrecioTotal(
                reservaDto.id_depto,
                reservaDto.desde,
                reservaDto.hasta
            );

            //creamos la reserva
            const nuevaReserva = this.reservasService.create({
                ...reservaDto,
                estado_reserva: EstadoReserva.PENDIENTE,
                precio_total_depto,
            });
            //guardamos la reserva
            await this.reservasService.save(nuevaReserva);

            return nuevaReserva;
        } catch (error) {
            console.error("Error en el servicio de reserva de departamento", error);
            if (error instanceof QueryFailedError)
                throw new HttpException(`${error.name} ${error.driverError}`, 404)
            throw new HttpException(error.message, error.status)
        }
    }

    /**
     * @description Calcula el precio total de un departamento para las fechas de la reserva.
     * @param id_depto 
     * @param desde 
     * @param hasta 
     * @returns El precio total del departamento
     */
    async calcularPrecioTotal(id_depto: number, desde: Date, hasta: Date): Promise<number> {
        const depto = await this.deptoService.findOne({ where: { id: id_depto } });
        console.log("depto", depto);
        if (!depto) {
            throw new Error('El departamento no existe');
        }

        //extraemos el precio base del departamento, si viene null o undefined, lo seteamos en 0
        const precio_base_depto = depto.precio_base_depto || 0;
        console.log("precio_base_depto", precio_base_depto);
        //calculamos la cantidad de dias entre las fechas
        const dias = differenceInCalendarDays(hasta, desde);
      
        //calculamos el precio total, multiplicando el precio base por el numero de dias q se va a qeudar en el lugar
        const precio_total = precio_base_depto * dias;
        return precio_total;
    }


    /**
     * @description Maneja las reservas múltiples de un departamento.
     * @param reservaDto 
     * @returns La reserva creada
     */
    async manejarReservasMultiples(reservaDto: ReservasDeptoDto): Promise<ReservasDeptoDto> {
        try {
            //Verificamos si existen reservas para las mismas fechas
            const reservasExistentes = await this.reservasService.find({
                where: {
                    id_depto: reservaDto.id_depto,
                    desde: LessThanOrEqual(reservaDto.hasta),
                    hasta: MoreThanOrEqual(reservaDto.desde)
                }
            });

            // Verificamos si hay alguna reserva aprobada
            const reservaAprobada = reservasExistentes.find(reserva => reserva.estado_reserva === 'APROBADA');
            if (reservaAprobada) {
                throw new NotFoundException('Ya existe una reserva aprobada para estas fechas');
            }

            const precio_total_depto = await this.calcularPrecioTotal(
                reservaDto.id_depto,
                reservaDto.desde,
                reservaDto.hasta
            );

            //si solo hay reservas pendientes, podemos crear una nueva reserva pendiente
            const nuevaReserva = this.reservasService.create({
                ...reservaDto,
                estado_reserva: EstadoReserva.PENDIENTE,
                precio_total_depto
            });

            //guardar la nueva reserva
            const reservaGuardada = await this.reservasService.save(nuevaReserva);

            //si es la primer reserva pendiente para estas fechas, la aprobamos automáticamente
            if (reservasExistentes.length === 0) {
                reservaGuardada.estado_reserva = EstadoReserva.APROBADA;
                await this.reservasService.save(reservaGuardada);
            }


            return reservaGuardada;

        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError)
                throw new HttpException(`${error.name} ${error.driverError}`, 404)
            throw new HttpException(error.message, error.status)
        }
    }

    /**
     * @description Muestra todas las reservas.
     * @returns Todas las reservas
     */
    async mostrarReservas(): Promise<ReservasDeptoDto[]> {
        try {
            const reservas = await this.reservasService.find();
            if (!reservas) {
                throw new NotFoundException('No se encontraron reservas');
            }
            console.log("reservas del servicio", reservas);
            return reservas;
        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError) 
                throw new HttpException(`${error.name} ${error.driverError}`, 404)
        }
    }
}