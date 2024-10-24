import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min } from "class-validator";
import { DepartamentoDto } from "./deptoDto";

export class CreateDeptoDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100, {message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombre: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    numero_depto: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(0, {message: 'El precio base debe ser un número positivo'})
    precio_base_depto?: number;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(12, {message: 'La capacidad del departamento debe ser entre 1 y 12 personas'})
    @IsOptional()
    capacidad?: number
}