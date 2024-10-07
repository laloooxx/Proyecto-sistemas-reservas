import { Module } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ParcelasController } from './parcelas.controller';
import { ParcelasEntity } from './entity/parcelas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParcelasEntity])],
  providers: [ParcelasService],
  controllers: [ParcelasController],
  exports: [ParcelasService]
})
export class ParcelasModule {}
