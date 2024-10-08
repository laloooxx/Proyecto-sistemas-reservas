import { IsNotEmpty, IsNumber, IsPositive, IsString, Length, Max, Min } from "class-validator";

export class DepartamentoDto {

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id_depto: number;

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
    @Min(0, {message: 'El precio base debe ser un número positivo'})
    precio_base_depto: number;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(12, {message: 'La capacidad del departamento debe ser entre 1 y 12 personas'})
    capacidad: number
}
