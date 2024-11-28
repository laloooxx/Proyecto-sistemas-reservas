import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { QueryFailedError } from "typeorm";

export function handleServiceError(error: any) {
    console.error("Error en el servicio ", error);
    if (error instanceof RpcException) {
        throw error;
    } 

    if (error instanceof QueryFailedError) {
        //verificamos si el error es en la consulta a la bd
        throw new RpcException(`Error en la consulta: ${error.message}`);
    }

    if (error instanceof NotFoundException) {
        //si el error ya es una BadRequestException, lanzarlo de nuevo
        throw new RpcException(error.message);
    }

    //para cualquier otro tipo de error lanzamos un error interno del servidor
    throw new RpcException(
        'Ocurrió un error inesperado en el servidor',
    )
};

export function handleControllerError(error: any) {
    console.error("Error en el controlador", error);

    if (error instanceof RpcException) {
        throw error;
    } 

  if (error instanceof HttpException) {
    // Si el error es una HttpException, lanzarlo de nuevo
    throw new RpcException(error.message);
  }

  // En caso de cualquier otro error, lanzar un error interno del servidor
  throw new RpcException('Ocurrió un error inesperado en el controlador');
}