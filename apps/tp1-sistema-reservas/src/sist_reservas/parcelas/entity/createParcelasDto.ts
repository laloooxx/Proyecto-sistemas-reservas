import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { EstadoParcela } from "../../../common/enum";

export class CreateParcelasDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(0, {message: 'El precio base debe ser un número positivo'})
    @IsOptional()
    precio_base_parc?: number;


    @IsEnum(EstadoParcela)
    @IsOptional()
    estado_parcela?: EstadoParcela;
}