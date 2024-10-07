import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

export function handleServiceError(error: any) {
    console.error("Error en el servicio ", error);
    if (error instanceof QueryFailedError) {
        //verificamos si el error es en la consulta a la bd
        throw new HttpException(
            `Error en la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    if (error instanceof NotFoundException) {
        //si el error ya es una BadRequestException, lanzarlo de nuevo
        throw error;
    }

    //para cualquier otro tipo de error lanzamos un error interno del servidor
    throw new HttpException(
        'Ocurrió un error inesperado',
        HttpStatus.INTERNAL_SERVER_ERROR
    )
};

export function handleControllerError(error: any) {
    console.error("Error en el controlador", error);

  if (error instanceof HttpException) {
    // Si el error es una HttpException, lanzarlo de nuevo
    throw error;
  }

  // En caso de cualquier otro error, lanzar un error interno del servidor
  throw new HttpException(
    'Ocurrió un error inesperado en el servidor',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}