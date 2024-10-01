import { Module } from '@nestjs/common'; 
import { DepartamentosModule } from './departamentos/departamentos.module';
import { ReservasDeptoModule } from './reservas_depto/reservas_depto.module';
import { ParcelasModule } from './parcelas/parcelas.module';
import { RegistroParcelasModule } from './registro_parcelas/registro_parcelas.module';
import { HistorialPagosModule } from './historial_pagos/historial_pagos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    DepartamentosModule,
    ReservasDeptoModule,
    ParcelasModule,
    RegistroParcelasModule,
    HistorialPagosModule,
    UsuariosModule],
  exports: [
    DepartamentosModule,
    ReservasDeptoModule,
    ParcelasModule,
    RegistroParcelasModule,
    HistorialPagosModule,
    UsuariosModule
  ]
})
export class ReservasModule { }
