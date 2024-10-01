import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";
import { EstadoParcela } from "../../../common/enum";

export class ParcelasDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_parcela: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(0, {message: 'El precio base debe ser un número positivo'})
    precio_base_parc: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(1, {message: 'El número de parcela debe ser un número positivo'})
    num_parcela: number;

    @IsEnum(EstadoParcela)
    @IsNotEmpty()
    estado_parcela: EstadoParcela;
}