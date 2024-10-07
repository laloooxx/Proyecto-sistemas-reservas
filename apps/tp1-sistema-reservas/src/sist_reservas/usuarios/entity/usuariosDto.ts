import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import { Role } from "../../../common/enum";

//funciona como un middleware, revisa q los valores q le va a pasar sean corretos
//
export class UserDto {
    id: number;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    @IsOptional()
    @IsString()
    avatar: string = "";

    @IsEnum(Role)
    role: string
}