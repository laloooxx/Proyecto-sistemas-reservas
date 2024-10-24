import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateParcelasDto } from './entity/createParcelasDto';
import { updateParcelaDto } from './entity/updateParcelaDto';
import { ParcelasDto } from './entity/parcelasDto';
import { handleControllerError } from '../../common';

@Controller('parcelas')
@ApiTags('parcelas')
export class ParcelasController {
    constructor(
        private readonly parcelasService: ParcelasService) { }

    @Post()
    async createParcela(@Body() parcelaDto: CreateParcelasDto) {
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

    @Get()
    async findParcelas(): Promise<CreateParcelasDto[]> {
        try {
            const parcelas = await this.parcelasService.buscarParcelas();

            return parcelas;
        } catch (error) {
            handleControllerError(error);
        }
    }

    @Get(':id')
    async findOneParcela(@Param('id') id: number): Promise<ParcelasDto> {
        try {
            const parcelaId = await this.parcelasService.buscarUnaParcela(id);

            if (!parcelaId) {
                throw new NotFoundException(`La parcela con id ${id} no fue encontrada.`)
            }

            return parcelaId;
        } catch (error) {
            handleControllerError(error);
        }
    }

    @Patch(':id')
    async updateParcela(@Param('id') id: number,
        @Body() parcela: Partial<updateParcelaDto>) {
        try {
            const parcelaNew = this.parcelasService.actualizarParcela(id, parcela);

            if (!parcelaNew) {
                throw new NotFoundException(`La parcela con id ${id} no fue encontrada.`)
            }

            return {
                message: `La parcela con id ${id} fue actualizada correctamente`,
                data: parcelaNew
            }
        } catch (error) {
            handleControllerError(error);
        }
    }

    @Delete(':id')
    async removeParcela(@Param('id') id: number) {
        try {
            const parcela = await this.parcelasService.eliminarParcela(id);

            if (!parcela) {
                throw new NotFoundException(`Parcela con el ${id} no fue encontrada`);
            }

            return {
                message: `Parcela con el id: ${id} fue eliminada correctamente`,
            }
        } catch (error) {
            handleControllerError(error);
        }
    }
}
