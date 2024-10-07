import { IsOptional, IsString, Matches } from "class-validator";


export class PaginatorDto {
    //limit es el q nos va a limitar el numero de registros q se va hacer con la query, cuando la bd se da cuenta de q la cantidad q esta devolviendo es la q pediste en el limit deja de hcaer la consulta, si le pongo limit 20 va a traer 20 y el 21 no lo devuelve 
    @IsOptional()
    @IsString()
    @Matches(/^\d+$/, { message: 'page must be a number string' })
    //La página que queremos consultar
    page?: string;
    //offset sirve para decirle a sql q se salte los primeros n de resultados donde n es el numero q ponemos como parametro. Si le pongo offset 20 y limit 20, saltara los primeros 20 resultados y devolvera los 20 siguientes. El offset tiene q ser = (pag - 1 ) * limit
    @IsOptional()
    @IsString()
    @Matches(/^\d+$/, { message: 'page must be a number string' })
    //Cuántos elementos queremos que contenga esa página?
    take?: string;

    // Para poder consultar usuarios por nombre
    @IsOptional()
    @IsString()
    search?: string
}