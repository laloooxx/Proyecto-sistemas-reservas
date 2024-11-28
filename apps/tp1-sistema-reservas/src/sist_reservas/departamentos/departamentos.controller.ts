import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { handleControllerError } from '../../common';
import { DepartamentosService } from './departamentos.service';
import { CreateDeptoDto } from './entity/createDeptoDto';
import { DepartamentoDto } from './entity/deptoDto';
import { updateDepartamentoDto } from './entity/updateCreateDto';

@Controller('departamentos')
export class DepartamentosController {
    constructor (
        private readonly departamentosService: DepartamentosService,
    ) {} 

    /**
     * @description evento para mostrar los departamentos creados
     * @returns todos los departamentos
     */
    @MessagePattern({cmd: 'get-depto'})
    async getDepartamentos(): Promise<DepartamentoDto[]> {
        try {
            const mostraDepto = await this.departamentosService.mostrarDeptos();
            return mostraDepto;
        } catch (error) {
            handleControllerError(error);
        }
    }



     /**
     * @description evento para mostrr un solo departamento 
     * @param id_depto el id del departamento q queremos mostrar 
     * @returns el departamento filtrado x su id
     */
    @MessagePattern({cmd: 'find-depto'})
    async findOneDepto(@Payload() id_depto: number): Promise<CreateDeptoDto> {
        try {
            const depto = await this.departamentosService.obtenerDeptoById(id_depto);

            if (!depto) {
                throw new RpcException(`La parcela con id ${id_depto} no fue encontrada.`)
            }

            return depto;
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description evento para crear un departamento segun los parametros del dto
     * @param departamentoDto los valores del departamento dto 
     * @returns el nuevo departamento creado 
     */
    @MessagePattern({cmd: 'crear-depto'}) 
    async createDepto(@Payload() deptoDto: CreateDeptoDto) {
        try {
            const newDepto = await this.departamentosService.crearDepto(deptoDto);

            return {
                message: 'Departamento creado con exito',
                data: newDepto
            };
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description evento para actualizar un departamento x su id
     * @param id el id del departamento q queremos actualizar
     * @param depto en el body de la peticion vamos a recibir el departamento del dto q queremos modificar
     * @returns el nuevo departamento modificado
     */
    @MessagePattern({cmd: 'update-depto'})
    async updateDepartamento(
        @Payload() data: { id_depto: number, depto: updateDepartamentoDto, role: string },
    ) {
        //desestructuramos el objeto
        const { id_depto, depto, role } = data;
        
        if (!id_depto) {
            throw new RpcException('Departamento no encontrado');
        }

        if (!depto ) {
            throw new RpcException('El departamento no existe');
        }

        try {
            const result = await this.departamentosService.actualizarDepto(id_depto, depto);
            
            
            return {
                message: 'Departamento actualizado correctamente',
                data: result
            };
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description evento para eliminar un departamento segun su id
     * @param id el id del departamento q queremos eliminar
     * @returns un mensaje que el departamento fue eliminado correctamente
     */
    @MessagePattern({cmd: 'delete-depto'})
    async deleteDepto(@Payload('id', ParseIntPipe) id: number) {
        try {
            const result = await this.departamentosService.eliminarDepto(id);

            if (!result) {
                throw new RpcException(`El departamento con id ${id} no fue encontrado.`);
            }

            return `El departamento con el id ${id} fue eliminado correctamente`;
        } catch (error) {
            handleControllerError(error);
        }
    }
}
