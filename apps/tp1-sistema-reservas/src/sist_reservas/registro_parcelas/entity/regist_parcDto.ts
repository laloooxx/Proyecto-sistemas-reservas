import { Type } from "class-transformer";
import { IsAlphanumeric, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";


export class Registro_parcelasDto {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    precio_total_parc?: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    f_ingreso: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    f_salida: Date;

    @IsAlphanumeric()
    @IsOptional()
    codigo_unico_parcela?: string;
}