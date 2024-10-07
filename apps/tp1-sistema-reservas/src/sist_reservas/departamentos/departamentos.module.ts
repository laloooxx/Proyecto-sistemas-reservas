import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentosEntity } from './entity/departamentos.entity';

@Module({
  providers: [DepartamentosService],
  controllers: [DepartamentosController],
  imports: [TypeOrmModule.forFeature([DepartamentosEntity])],
  exports: [DepartamentosService]
})
export class DepartamentosModule {}
