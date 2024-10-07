import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { envs } from "./env";


export const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: envs.host,
    port: envs.dbPort,
    username: envs.user,
    password: envs.pass,
    database: envs.database,
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
}
