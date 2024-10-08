import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartamentosService } from './departamentos.service';
import { DepartamentoDto } from './entity/departamentoDto';
import { handleControllerError } from '../../common';

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
        @Body() depto: Partial<DepartamentoDto>
    ) {
        try {
            const result = await this.departamentosService.actualizarDepto(id, depto);
            
            return result;
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

            return (`El departamento con el id ${id} fue eliminado correctamente`);
        } catch (error) {
            handleControllerError(error);
        }
    }


    /**
     * @description endpoint para crear un departamento segun los parametros del dto
     * @param departamentoDto los valores del departamento dto 
     * @returns el nuevo departamento creado 
     */
    @Post('crear-departamento') 
    async createDepto(departamentoDto: DepartamentoDto) {
        try {
            const newDepto = await this.departamentosService.crearDepto(departamentoDto);

            return newDepto;
        } catch (error) {
            handleControllerError(error);
        }
    }
}
