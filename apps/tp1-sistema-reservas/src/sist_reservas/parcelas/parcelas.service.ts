import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParcelasDto } from './entity/createParcelasDto';
import { ParcelasDto } from './entity/parcelasDto';
import { updateParcelaDto } from './entity/updateParcelaDto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParcelasEntity } from './entity/parcelas.entity';
import { Repository } from 'typeorm';
import { handleServiceError } from '../../common';

@Injectable()
export class ParcelasService {
    constructor(
        @InjectRepository(ParcelasEntity)
        private readonly parcelaRepository: Repository<ParcelasEntity>
    ) { }


    /**
     * @description creamos una nueva parcela
     * @param parcelaDto los valores q tenemos del dto
     * @returns la parcela creada
     */
    async crearParcela(parcelaDto: CreateParcelasDto): Promise<CreateParcelasDto> {
        try {
            const newParcela = this.parcelaRepository.create(parcelaDto);
            const parcelaCreada = await this.parcelaRepository.save(newParcela);

            return parcelaCreada;
        } catch (error) {
            handleServiceError(error);
        }
    }


    /**
     * @description mostramos las parcelas creadas y almacenadas en la base de datos
     * @returns todas las parcelas
     */
    async buscarParcelas(): Promise<CreateParcelasDto[]> {
        try {
            const parcela = await this.parcelaRepository.find();
        if (!parcela) {
            throw new NotFoundException('No existen parcelas')
        }

        return parcela;
        } catch (error) {
            handleServiceError(error);
        }
    }


    /**
     * @description buscamos la parcela x su id
     * @param id el id de la parcela q queremos filtrar
     * @returns la parcela filtrada x su id
     */
   async buscarUnaParcela(id: number): Promise<ParcelasDto> {
        try {
            const parcelaId = await this.parcelaRepository.findOne(
                {
                    where: { id_parcela: id}
                }
            )
            if (!parcelaId) {
                throw new NotFoundException(`La parcela con el id ${id} no fue encontrada`)
            }

            return parcelaId;
        } catch (error) {
            handleServiceError(error);
        }
    }


    /**
     * @description actualizamos la parcela seleccionada filtrada x su id
     * @param id el id de la parcela q queremos modificar
     * @param parcela los datos de la parcela q tenemos en el dto
     * @returns la parcela actualizada
     */
    async actualizarParcela(id: number, parcela: Partial<updateParcelaDto>) {
        try {
            const parcelaOld = await this.parcelaRepository.findOne( {
                where: {
                    id_parcela: id
                }
            })

            if (!parcelaOld) {
                throw new NotFoundException(`La parcela con el id ${id} no fue encontrada`)
            }

            const mergeParcela = this.parcelaRepository.merge(parcelaOld, parcela);

            const result = await this.parcelaRepository.save(mergeParcela);

            return result;
        } catch (error) {
            handleServiceError(error);
        }
    }


    /**
     * @description eliminamos una parcela 
     * @param id el id de la parcela q queremos eliminar
     * @returns la parcela eliminada
     */
    async eliminarParcela(id: number): Promise<any> {
        try {
            const parcela = await this.parcelaRepository.delete(id);

            if (!parcela) {
                throw new NotFoundException(`La parcela con el id ${id} no fue encontrada`)
            }

            return parcela;
        } catch (error) {
            handleServiceError(error);
        }
    }
}
