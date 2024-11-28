import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { handleControllerError } from '../../common';
import { PaginatorDto } from '../../common/paginatorDto';
import { PaginatorRegistroParcelas } from '../../common/types';
import { Registro_parcelasDto } from './entity/regist_parcDto';
import { RegistroParcelasService } from './registro_parcelas.service';


@Controller('registro-parcelas')
export class RegistroParcelasController {
    constructor(
        private readonly registroParcelasService: RegistroParcelasService,
    ) { }

    /**
     * @description evento para registrar el ingreso de un cliente a una parcela 
     * @param registroDto datos del registro de ingreso
     * @param id_parcela el id de la parcela a la qse ingresa
     * @returns el registro del ingreso
     */
    @MessagePattern('registrar_ingreso')
    async registrarIngreso(
        @Payload() data: {registroDto: Registro_parcelasDto, id_parcela: number,id_usuario: number, usuario?: any}
    ): Promise<Registro_parcelasDto> {
        const {registroDto, id_parcela, id_usuario, usuario } = data;

        try {
            /**const parcelaDto: ParcelasDto = { id_parcela: id_parcela, precio_base_parc: 0 , estado_parcela: EstadoParcela.OCUPADA } as ParcelasDto;*/
            const registroParcela = await this.registroParcelasService.registrarIngreso(registroDto, id_parcela, id_usuario, usuario);

            return registroParcela;
        } catch (error) {
            if (error instanceof RpcException) {
            throw error;
        }

        // Para otros tipos de errores
        throw new RpcException(
            error.message || 'Ocurrió un error inesperado en el controlador'
        );
    }
    }

    /**
     * @description evento para registrar la salida de un cliente de una parcela.
     * @param codigoUnico codigo unico de ingreso que el cliente debe proporcionar para salir.
     * @returns el registro actualizado  con la fecha de salida
     */
    @MessagePattern('registrar_salida')
    async registrarSalida(
        @Payload() data: {  codigoUnico: string, id_usuario: number }): Promise<Registro_parcelasDto> {
        try {
            const { codigoUnico, id_usuario } = data;
            const registroParcela = await this.registroParcelasService.registrarSalida(codigoUnico, id_usuario);

            return registroParcela;
        } catch (error) {
            handleControllerError(error);
        }
    }

    /**
     * @description evento para obtener todos los registros
     * @returns todos los registros
     */
    @MessagePattern('obtener_registros')
    async obtenerRegistros(@Payload() params: PaginatorDto): Promise<PaginatorRegistroParcelas> {
        try {
            return await this.registroParcelasService.mostrarRegistrosParcelas(params);     
        } catch (error) {
            handleControllerError(error);
        }
    }


/**
 * @description evento para eliminar un registro de parcela por su código único.
 * @param codigoUnico El código único del registro a eliminar.
 * @returns Mensaje de éxito o error si no se encuentra el registro.
 */
@MessagePattern('eliminar-registro')
async eliminarRegistro(
  @Payload('codigoUnico') codigoUnico: string
): Promise<string> {
  try {
    return await this.registroParcelasService.eliminarRegistroPorCodigoUnico(codigoUnico);
  } catch (error) {
    handleControllerError(error);
  }
}

}
