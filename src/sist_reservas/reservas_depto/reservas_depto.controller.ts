import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { ReservasDeptoService } from './reservas_depto.service';
import { ReservasDeptoDto } from './entity/reservas_deptoDto';
import { Response } from 'express';
import { DepartamentosService } from '../departamentos/departamentos.service';

@Controller('reservas-depto')
export class ReservasDeptoController {
    constructor(
        private readonly reservasService: ReservasDeptoService,
        private readonly deptoService: DepartamentosService
    ) { }

    @Post()
    async create(@Body() reservaDto: ReservasDeptoDto, @Res() response: Response) {
        try {
            const reserva = await this.reservasService.crearReserva(reservaDto);

            return response
                .status(HttpStatus.CREATED)
                .json({
                    ok: true,
                    message: 'Reserva creada correctamente',
                    reserva
                });
        } catch (error) {
            console.error("Error en el controlador de reserva de departamento", error);
            return response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    message: error.message,
                    error: true
                });
        }
    }

    @Post('reservas-pendientes')
    async reservasPendientes(@Body() reservaDto: ReservasDeptoDto, @Res() response: Response) {
        try {
            const reserva = await this.reservasService.manejarReservasMultiples(reservaDto);

            return response 
                .status(HttpStatus.OK)
                .json({
                    message: 'Reserva procesada correctamente',
                    data: reserva
                })
        } catch (error) {
            console.error("Error en el controlador de reserva de departamento", error);
            return response 
                .status(HttpStatus.BAD_REQUEST)
                .json({
                    message: error.message,
                    error: true
                })
        }
    }

    @Get()
    async mostrarReservas(@Res() response: Response) {
        try {
            const reservas = await this.reservasService.mostrarReservas();
            
            return response
                .status(HttpStatus.ACCEPTED)
                .json({
                    message: 'Reservas encontradas correctamente',
                    reservas
                })
        } catch (error) {
            console.error("Error en el controlador de reserva de departamento", error);
            return response
                .status(HttpStatus.NOT_FOUND)
                .json({
                    message: error.message,
                    error: true
                })
        }
    }
}