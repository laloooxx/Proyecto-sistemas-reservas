import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { envs } from "./env";
import { DepartamentosEntity } from "src/sist_reservas/departamentos/entity/departamentos.entity";
import { UsuariosEntity } from "src/sist_reservas/usuarios/entity/usuarios.entity";
import { ReservasDeptoEntity } from "src/sist_reservas/reservas_depto/entity/reservas_depto_entity";
import { ParcelasEntity } from "src/sist_reservas/parcelas/entity/parcelas.entity";
import { Registro_parcelasEntity } from "src/sist_reservas/registro_parcelas/entity/regist_parc_entity";
import { Historial_pagosEntity } from "src/sist_reservas/historial_pagos/entity/hist_pag_entity";


export const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: envs.host,
    port: envs.dbPort,
    username: envs.user,
    password: envs.pass,
    database: envs.database,
    entities: [
        DepartamentosEntity, 
        ReservasDeptoEntity, 
        ParcelasEntity, 
        Registro_parcelasEntity, 
        Historial_pagosEntity, 
        UsuariosEntity
    ],
    autoLoadEntities: true,
    synchronize: true,
}
