import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosEntity } from './entity/usuarios.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsuariosService],
  controllers: [UsuariosController],
  imports: [TypeOrmModule.forFeature([UsuariosEntity])],
})
export class UsuariosModule {}
