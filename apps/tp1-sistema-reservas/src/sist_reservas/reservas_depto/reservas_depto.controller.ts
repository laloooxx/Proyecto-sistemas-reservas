import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { handleControllerError } from '../../common';
import { PaginatorDto } from '../../common/paginatorDto';
import { PaginatedReservas } from '../../common/types';
import { CreateReservaDto } from './entity/create_reservas_deptoDto';
import { ReservasDeptoService } from './reservas_depto.service';

@Controller('reservas')
@ApiTags('reservas')
export class ReservasDeptoController {
    constructor(
        private readonly reservasService: ReservasDeptoService,
    ) { }

    @Post('crear-reserva/:idDepto')
    async create(
        @Body() reservaDto: CreateReservaDto,
        @Res() response: Response,
        @Param('idDepto') idDepto: number,
    ) {
        try {
            const reserva = await this.reservasService.crearReserva(reservaDto, idDepto);

            return response
                .status(HttpStatus.CREATED)
                .json({
                    ok: true,
                    message: 'Reserva creada correctamente',
                    reserva
                });
        } catch (error) {
            console.error("Error en el controlador de reserva de departamento", error);
            handleControllerError(error);
        }
    }

    @Post('reservas-pendientes')
    async reservasPendientes(@Body() reservaDto: CreateReservaDto, @Res() response: Response, @Param() id_depto: number) {
        try {
            const reserva = await this.reservasService.manejarReservasMultiples(reservaDto, id_depto);

            return response
                .status(HttpStatus.OK)
                .json({
                    message: 'Reserva procesada correctamente',
                    data: reserva
                })
        } catch (error) {
            handleControllerError(error);
        }
    }


    @Post('registrar-salida/:id_reserva_depto')
    async registrarSalida(@Param('id_reserva_depto') id_reserva_depto: number): Promise<CreateReservaDto> {
        try {
            const reservaTerminada = await this.reservasService.registrarSalidaDepto(id_reserva_depto);
            
            return reservaTerminada;
        } catch (error) {
            handleControllerError(error);
        }
    }

    @Get()
    async mostrarReservas(@Query() params: PaginatorDto): Promise<PaginatedReservas> {
        try {
            return this.reservasService.mostrarReservas(params)  
        } catch (error) {
            handleControllerError(error);
        } 
    }
}