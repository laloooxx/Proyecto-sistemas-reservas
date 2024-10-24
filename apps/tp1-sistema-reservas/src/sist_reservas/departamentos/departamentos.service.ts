import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleServiceError } from '../../common';
import { CreateDeptoDto } from './entity/createDeptoDto';

import { DepartamentosEntity } from './entity/departamentos.entity';
import { DepartamentoDto } from './entity/deptoDto';
import { updateDepartamentoDto } from './entity/updateCreateDto';

@Injectable()
export class DepartamentosService {
    constructor(
        @InjectRepository(DepartamentosEntity)
        private readonly deptoRepository: Repository<DepartamentosEntity>
    ) { }

    /**
     * @description mostramos los departamentos creados y almacenados en la base de datos
     * @returns todos los departamentos
     */
    async mostrarDeptos(): Promise<DepartamentoDto[]> {
        try {
            const depto = await this.deptoRepository.find();

            if (!depto) {
                throw new NotFoundException('No existen departamentos');
            }

            return depto;
        }
        catch (err) {
            handleServiceError(err);
        }
    }


    /**
     * @description buscamos al departamento x su id
     * @param id el id del departamento q queremos buscar 
     * @returns el departamento filtrado x el id
     */
    async obtenerDeptoById(id: number): Promise<CreateDeptoDto> {
        try {
            const deptoById = await this.deptoRepository.findOne({
                where: { id_depto: id }
            });
            if (!deptoById) {
                throw new NotFoundException(`El departamento con el id ${id} no fue encontrado`)
            }

            return deptoById;
        } catch (err) {
            handleServiceError(err);
        }
    }

    /**
     * @description creamos un nuevo departamento 
     * @param departamentoDto Los valores q tenemos en el dto 
     * @returns el departamento creado 
     */
    async crearDepto(departamentoDto: CreateDeptoDto): Promise<CreateDeptoDto> {
        try {
            if (!departamentoDto.nombre || departamentoDto.nombre.trim().length === 0) {
                throw new NotFoundException("El nombre no puede ser vacio.")
            };

            const existDepto = await this.deptoRepository.findOne({
                where: { numero_depto: departamentoDto.numero_depto }
            });

            if (existDepto) {
                throw new NotFoundException(`El número de departamento ${departamentoDto.numero_depto} ya está en uso.`)
            };

            if (departamentoDto.capacidad < 1 && departamentoDto.capacidad > 12) {
                throw new NotFoundException('La capacidad del departamento debe ser entre 1 y 12 personas')
            }

            const newDepto = this.deptoRepository.create(departamentoDto);

            const deptoSaved = await this.deptoRepository.save(newDepto);

            return deptoSaved;
        } catch (error) {
            handleServiceError(error);
        }
    }


    /**
     * 
     * @param id el id del departamento q queremos actualizar
     * @param depto el departamento del dto parcial 
     * @returns el nuevo departamento modificado
     */
    async actualizarDepto(id: number, depto: Partial<updateDepartamentoDto>) {
        try {
            const oldDepto = await this.deptoRepository.findOne({
                where: { id_depto: id }
            })

            if (!oldDepto) {
                throw new NotFoundException(`El departamento con el id ${id} no fue encontrado`)
            };

            const mergeDepto = this.deptoRepository.merge(oldDepto, depto);

            const result = await this.deptoRepository.save(mergeDepto);

            return result;

        } catch (err) {
            handleServiceError(err);
        }
    }


    /**
     * @description eliminamos un departamento
     * @param id el id del departamento q queremos eliminar
     * @returns un mensaje q dice q el depto fue eliminado correctamente
     */
    async eliminarDepto(id: number): Promise<any> {
        try {
            const depto = await this.deptoRepository.delete(id);

            if (!depto) {
                throw new NotFoundException(`El departamento con el id ${id} no fue encontrado`)
            };

            return depto;
        } catch (error) {
            handleServiceError(error);
        }

    }
}
