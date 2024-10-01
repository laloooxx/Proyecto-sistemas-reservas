import { Module } from '@nestjs/common';
import { RegistroParcelasService } from './registro_parcelas.service';
import { RegistroParcelasController } from './registro_parcelas.controller';
import { Registro_parcelasEntity } from './entity/regist_parc_entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RegistroParcelasService],
  controllers: [RegistroParcelasController],
  imports: [TypeOrmModule.forFeature([Registro_parcelasEntity])],
  exports: [RegistroParcelasService]
})
export class RegistroParcelasModule {}
