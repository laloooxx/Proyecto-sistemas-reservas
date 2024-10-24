import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartamentosService } from './departamentos.service';
import { CreateDeptoDto } from './entity/createDeptoDto';
import { DepartamentoDto  } from './entity/deptoDto';
import { handleControllerError } from '../../common';
import { updateDepartamentoDto } from './entity/updateCreateDto';

@Controller('departamentos')
@ApiTags('departamentos')
export class DepartamentosController {
    constructor (
        private readonly departamentosService: DepartamentosService,
    ) {} 

    /**
     * @description endpoint para mostrar los departamentos creados
     * @returns todos los departamentos
     */
    @Get()
    async getDepartamentos(): Promise<DepartamentoDto[]> {
        try {
            const mostraDepto = await this.departamentosService.mostrarDeptos();
            return mostraDepto;
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * 
     * @param id el id del departamento q queremos actualizar
     * @param depto en el body de la peticion vamos a recibir el departamento del dto q queremos modificar
     * @returns el nuevo departamento modificado
     */
    @Patch(':id')
    async updateDepartamento(
        @Param('id') id: number,
        @Body() depto: Partial<updateDepartamentoDto>
    ) {
        try {
            const result = await this.departamentosService.actualizarDepto(id, depto);
            
            if (!result) {
                throw new NotFoundException(`El departamento con id ${id} no fue encontrado.`);
            }

            return {
                message: 'Departamento actualizado correctamente',
                data: result
            };
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description endpoint para eliminar un departamento segun su id
     * @param id el id del departamento q queremos eliminar
     * @returns un mensaje que el departamento fue eliminado correctamente
     */
    @Delete(':id')
    async deleteDepto(@Param('id') id: number) {
        try {
            const result = await this.departamentosService.eliminarDepto(id);

            if (!result) {
                throw new NotFoundException(`El departamento con id ${id} no fue encontrado.`);
            }

            return `El departamento con el id ${id} fue eliminado correctamente`;
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description endpoint para crear un departamento segun los parametros del dto
     * @param departamentoDto los valores del departamento dto 
     * @returns el nuevo departamento creado 
     */
    @Post() 
    async createDepto(@Body() deptoDto: CreateDeptoDto) {
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
}
