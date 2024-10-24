import { Module } from '@nestjs/common';

import { ReservasDeptoController } from './reservas_depto.controller';
import { ReservasDeptoEntity } from './entity/reservas_depto_entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasDeptoService } from './reservas_depto.service';
import { DepartamentosEntity } from '../departamentos/entity/departamentos.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DepartamentosModule } from '../departamentos/departamentos.module';

@Module({
  //el modelo q vos creas lo lleva a la base de datos, crea una vista de las tablas para q el orm cree las tablas
  //registramos el cliente del microservice, es el q maneja el microservicio
  imports: [TypeOrmModule.forFeature([ReservasDeptoEntity, DepartamentosEntity]), ClientsModule.register([{
     name: 'Mailer_MS', 
     transport: Transport.TCP, 
     options: {
        port: 3001, 
        host: 'localhost'}}]), DepartamentosModule],
  providers: [ReservasDeptoService],
  controllers: [ReservasDeptoController],
  exports: [ReservasDeptoService]
})
export class ReservasDeptoModule {}
