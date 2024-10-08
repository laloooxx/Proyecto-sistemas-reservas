import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ReservasDeptoService } from './reservas_depto.service';
import { ReservasDeptoDto } from './entity/reservas_deptoDto';
import { Response } from 'express';
import { DepartamentoDto } from '../departamentos/entity/departamentoDto';
import { PaginatorDto } from '../../common/paginatorDto';
import { PaginatedReservas } from '../../common/types';
import { ApiTags } from '@nestjs/swagger';

@Controller('reservas')
@ApiTags('reservas')
export class ReservasDeptoController {
    constructor(
        private readonly reservasService: ReservasDeptoService,
    ) { }

    @Post('crear-reserva/:idDepto')
    async create(
        @Body() reservaDto: ReservasDeptoDto,
        @Res() response: Response,
        @Param('idDepto') idDepto: DepartamentoDto,
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
    async mostrarReservas(@Query() params: PaginatorDto): Promise<PaginatedReservas> {
        return this.reservasService.mostrarReservas(params)
    }
}