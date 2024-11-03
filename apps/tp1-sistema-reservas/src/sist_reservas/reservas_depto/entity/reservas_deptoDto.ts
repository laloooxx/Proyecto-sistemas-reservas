import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ReservaDeptoDto {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id_reserva_depto: number;
}