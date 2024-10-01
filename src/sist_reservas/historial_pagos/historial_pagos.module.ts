import { Module } from '@nestjs/common';
import { HistorialPagosService } from './historial_pagos.service';
import { HistorialPagosController } from './historial_pagos.controller';
import { Historial_pagosEntity } from './entity/hist_pag_entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [HistorialPagosService],
  controllers: [HistorialPagosController],
  imports: [TypeOrmModule.forFeature([Historial_pagosEntity])],
})
export class HistorialPagosModule {}
