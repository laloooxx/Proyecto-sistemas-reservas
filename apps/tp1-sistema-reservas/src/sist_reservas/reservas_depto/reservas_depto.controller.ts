import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { handleControllerError } from '../../common';
import { PaginatorDto } from '../../common/paginatorDto';
import { PaginatedReservas } from '../../common/types';
import { CreateReservaDto } from './entity/create_reservas_deptoDto';
import { ReservasDeptoService } from './reservas_depto.service';

@Controller('reservas')
export class ReservasDeptoController {
    constructor(
        private readonly reservasService: ReservasDeptoService,
    ) { }

    @MessagePattern({cmd: 'crear-reserva'})
    async create(
        @Payload() data: { reservaDto: CreateReservaDto, id_depto: number, id_usuario: number}
    ): Promise<CreateReservaDto> {
        const { reservaDto, id_depto, id_usuario } = data;
        try {
            const reserva = await this.reservasService.crearReserva(reservaDto, id_depto, id_usuario);

            return reserva;
        } catch (error) {
            console.error("Error en el controlador de reserva de departamento", error);
            handleControllerError(error);
        }
    }

    @MessagePattern({cmd: 'reservas-pendientes'})
    async reservasPendientes(
        @Payload() data: { reservaDto: CreateReservaDto, id_depto: number} 
        ): Promise<CreateReservaDto> {
            const { reservaDto, id_depto } = data;
        try {
            const reserva = await this.reservasService.manejarReservasMultiples(reservaDto, id_depto);

           return reserva;
        } catch (error) {
            handleControllerError(error);
        }
    }


    @MessagePattern({ cmd: 'registrar-salida'})
    async registrarSalida(@Payload() payload: {id_reserva_depto: number}): Promise<CreateReservaDto> {
        try {
            const reservaTerminada = await this.reservasService.registrarSalidaDepto(payload.id_reserva_depto);
            
            return reservaTerminada;
        } catch (error) {
            handleControllerError(error);
        }
    }

    @MessagePattern({cmd: 'mostrar-reservas'})
    async mostrarReservas(@Payload() params: PaginatorDto): Promise<PaginatedReservas> {
        try {
            return this.reservasService.mostrarReservas(params)  
        } catch (error) {
            handleControllerError(error);
        } 
    }
}