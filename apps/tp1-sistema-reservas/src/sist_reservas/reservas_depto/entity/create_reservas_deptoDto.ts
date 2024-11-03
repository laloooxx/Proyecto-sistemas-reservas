import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { EstadoReserva } from "../../../common/enum";
import { Type } from "class-transformer";

export class CreateReservaDto {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    desde: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    hasta: Date;

    @IsOptional()
    @IsEnum(EstadoReserva)
    estado_reserva?: EstadoReserva;

    @IsNumber()
    @IsPositive()
    @Min(0, {message: 'El precio total debe ser un número positivo'})
    @IsOptional()
    precio_total_depto?: number;

    @IsBoolean()
    @IsOptional()
    reserva_pagada?: boolean;

    @IsBoolean()
    @IsOptional()
    user_aprob_reserv?: boolean;

}