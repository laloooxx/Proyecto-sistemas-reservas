import { Module } from '@nestjs/common';
import { RegistroParcelasService } from './registro_parcelas.service';
import { RegistroParcelasController } from './registro_parcelas.controller';
import { Registro_parcelasEntity } from './entity/regist_parc_entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelasEntity } from '../parcelas/entity/parcelas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registro_parcelasEntity, ParcelasEntity])],
  providers: [RegistroParcelasService],
  controllers: [RegistroParcelasController],
  exports: [RegistroParcelasService]
})
export class RegistroParcelasModule {}
