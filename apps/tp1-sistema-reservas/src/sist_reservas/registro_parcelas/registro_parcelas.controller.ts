import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { handleControllerError } from '../../common';
import { ParcelasDto } from '../parcelas/entity/parcelasDto';
import { Registro_parcelasDto } from './entity/regist_parcDto';
import { RegistroParcelasService } from './registro_parcelas.service';
import { PaginatorRegistroParcelas } from '../../common/types';
import { PaginatorDto } from '../../common/paginatorDto';


@Controller('registro-parcelas')
export class RegistroParcelasController {
    constructor(
        private readonly registroParcelasService: RegistroParcelasService,
    ) { }

    /**
     * @description Endpoint para registrar el ingreso de un cliente a una parcela 
     * @param registroDto datos del registro de ingreso
     * @param id_parcela el id de la parcela a la qse ingresa
     * @returns el registro del ingreso
     */
    @Post('ingreso/:idParcela')
    async registrarIngreso(
        @Body() registroDto: Registro_parcelasDto,
        @Param('idParcela') id_parcela: number,
    ): Promise<Registro_parcelasDto> {
        try {
            const parcelaDto: ParcelasDto = { id_parcela: id_parcela } as ParcelasDto;

            const registroParcela = await this.registroParcelasService.registrarIngreso(registroDto, parcelaDto)

            return registroParcela;
        } catch (error) {
            handleControllerError(error);
        }
    }

    /**
     * @description endpoint para registrar la salida de un cliente de una parcela.
     * @param codigoUnico codigo unico de ingreso que el cliente debe proporcionar para salir.
     * @returns el registro actualizado  con la fecha de salida
     */
    @Post('salida/:codigoUnico')
    async registrarSalida(
        @Param('codigoUnico') codigoUnico: string): Promise<Registro_parcelasDto> {
        try {
            const registroParcela = await this.registroParcelasService.registrarSalida(codigoUnico);

            return registroParcela;
        } catch (error) {
            handleControllerError(error);
        }
    }

    /**
     * @description endpoint para obtener todos los registros
     * @returns todos los registros
     */
    @Get()
    async obtenerRegistros(@Query() params: PaginatorDto): Promise<PaginatorRegistroParcelas> {
        try {
            return await this.registroParcelasService.mostrarRegistrosParcelas(params);     
        } catch (error) {
            handleControllerError(error);
        }
    }
}
