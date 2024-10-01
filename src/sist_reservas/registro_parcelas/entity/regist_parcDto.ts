import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class Registro_parcelasDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_reg_parc: number;

    @IsNumber()
    @IsPositive()
    precio_total_parc: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    f_ingreso: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    f_salida: Date;
}