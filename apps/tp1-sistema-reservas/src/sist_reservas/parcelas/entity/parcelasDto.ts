import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ParcelasDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_parcela: number;
}