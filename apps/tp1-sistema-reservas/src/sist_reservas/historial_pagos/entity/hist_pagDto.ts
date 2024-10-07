import { IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";


export class Historial_pagosDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_hist_pago: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0, { message: "El precio base de la parcela no puede ser negativo" })
    precio_base_parc: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0, { message: "El precio base de la parcela no puede ser negativo" })
    precio_total_parc: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0, { message: "El precio base de la parcela no puede ser negativo" })
    precio_base_depto: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0, { message: "El precio base de la parcela no puede ser negativo" })
    precio_total_depto: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0, { message: "El precio base de la parcela no puede ser negativo" })
    precio_total_pago: number;
}