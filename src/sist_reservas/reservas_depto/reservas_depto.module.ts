import { Module } from '@nestjs/common';

import { ReservasDeptoController } from './reservas_depto.controller';
import { ReservasDeptoEntity } from './entity/reservas_depto_entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasDeptoService } from './reservas_depto.service';
import { DepartamentosEntity } from '../departamentos/entity/departamentos.entity';
import { DepartamentosModule } from 'src/config';

@Module({
  imports: [TypeOrmModule.forFeature([ReservasDeptoEntity, DepartamentosEntity]), DepartamentosModule],
  providers: [ReservasDeptoService],
  controllers: [ReservasDeptoController],
  exports: [ReservasDeptoService]
})
export class ReservasDeptoModule {}
