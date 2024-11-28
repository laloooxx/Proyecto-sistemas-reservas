import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { handleControllerError } from '../../common';
import { CreateParcelasDto } from './entity/createParcelasDto';
import { updateParcelaDto } from './entity/updateParcelaDto';
import { ParcelasService } from './parcelas.service';

@Controller('parcelas')
export class ParcelasController {
    constructor(
        private readonly parcelasService: ParcelasService) { }


    @MessagePattern({cmd: 'get-parcela'})
    async findParcelas(): Promise<CreateParcelasDto[]> {
        try {
            const parcelas = await this.parcelasService.buscarParcelas();

            return parcelas;
        } catch (error) {
            handleControllerError(error);
        }
    }

    @MessagePattern({cmd: 'find-parcela'})
    async findOneParcela(@Payload('id_parcela') id_parcela: number): Promise<CreateParcelasDto> {
        try {
            const parcela = await this.parcelasService.buscarUnaParcela(id_parcela);

            if (!parcela) {
                throw new RpcException(`La parcela con id ${id_parcela} no fue encontrada.`)
            }

            return parcela;
        } catch (error) {
            handleControllerError(error);
        }
    }

    
    @MessagePattern({cmd: 'create-parcela'})
    async createParcela(@Payload() parcelaDto: CreateParcelasDto) {
        try {
            const parcela = await this.parcelasService.crearParcela(parcelaDto);

            return {
                message: 'Parecela creada con exito',
                data: parcela
            }
        } catch (error) {
            handleControllerError(error);
        }
    }

    @MessagePattern({cmd: 'update-parcela'})
    async updateParcela(@Payload() data: { id_parcela:number, parcela: updateParcelaDto, id_usuario: number} ) {
            const { id_parcela, parcela, id_usuario } = data;
        try {
            
            const parcelaNew = this.parcelasService.actualizarParcela(id_parcela, parcela);

            if (!parcelaNew) {
                throw new RpcException(`La parcela con id ${id_parcela} no fue encontrada.`)
            }

            return {
                message: `La parcela con id ${id_parcela} fue actualizada correctamente`,
                data: data
            }
        } catch (error) {
            handleControllerError(error);
        }
    }

    @MessagePattern({cmd: 'delete-parcela'})
    async removeParcela(@Payload() id: number) {
        try {
            const parcela = await this.parcelasService.eliminarParcela(id);

            if (!parcela) {
                throw new RpcException(`Parcela con el ${id} no fue encontrada`);
            }

            return {
                message: `Parcela con el id: ${id} fue eliminada correctamente`,
            }
        } catch (error) {
            handleControllerError(error);
        }
    }
}
