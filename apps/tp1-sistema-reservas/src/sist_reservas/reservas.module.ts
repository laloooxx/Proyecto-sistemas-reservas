import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MAILER_SERVICE, USUARIO_SERVICE } from '../config';
import { DepartamentosController } from './departamentos/departamentos.controller';
import { DepartamentosService } from './departamentos/departamentos.service';
import { DepartamentosEntity } from './departamentos/entity/departamentos.entity';
import { Historial_pagosEntity } from './historial_pagos/entity/hist_pag_entity';
import { HistorialPagosController } from './historial_pagos/historial_pagos.controller';
import { HistorialPagosService } from './historial_pagos/historial_pagos.service';
import { ParcelasEntity } from './parcelas/entity/parcelas.entity';
import { ParcelasController } from './parcelas/parcelas.controller';
import { ParcelasService } from './parcelas/parcelas.service';
import { Registro_parcelasEntity } from './registro_parcelas/entity/regist_parc_entity';
import { RegistroParcelasController } from './registro_parcelas/registro_parcelas.controller';
import { RegistroParcelasService } from './registro_parcelas/registro_parcelas.service';
import { ReservasDeptoEntity } from './reservas_depto/entity/reservas_depto_entity';
import { ReservasDeptoController } from './reservas_depto/reservas_depto.controller';
import { ReservasDeptoService } from './reservas_depto/reservas_depto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    DepartamentosEntity,
    ReservasDeptoEntity,
    ParcelasEntity,
    Registro_parcelasEntity,
    Historial_pagosEntity
  ]),
  ClientsModule.register([
    {
      name: MAILER_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 3001,
        host: 'localhost',
      }
    },
    {
      name: USUARIO_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 3333,
        host: 'localhost',
      }
    }
  ]),
  ],
  controllers: [
    DepartamentosController,
    HistorialPagosController,
    RegistroParcelasController,
    ParcelasController,
    ReservasDeptoController
  ],
  providers: [
    DepartamentosService,
    ReservasDeptoService,
    ParcelasService,
    RegistroParcelasService,
    HistorialPagosService
  ],
  exports: [
    DepartamentosService,
    ReservasDeptoService,
    ParcelasService,
    RegistroParcelasService,
  ],
})
export class ReservasModule { }
