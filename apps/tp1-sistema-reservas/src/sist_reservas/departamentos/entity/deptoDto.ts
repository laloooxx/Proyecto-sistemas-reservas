import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { CreateDeptoDto } from "./createDeptoDto";


export class DepartamentoDto {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id_depto: number;
}
