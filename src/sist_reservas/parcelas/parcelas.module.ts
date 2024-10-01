import { Module } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ParcelasController } from './parcelas.controller';
import { ParcelasEntity } from './entity/parcelas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ParcelasService],
  controllers: [ParcelasController],
  imports: [TypeOrmModule.forFeature([ParcelasEntity])],
})
export class ParcelasModule {}
