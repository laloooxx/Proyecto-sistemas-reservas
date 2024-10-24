import { Module } from '@nestjs/common';
import { ReservasModule } from './sist_reservas/reservas.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/dbConfig';
import { ParcelasModule } from './sist_reservas/parcelas/parcelas.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(dbConfig),
    ReservasModule,
    ParcelasModule
  ],
})
export class AppModule {}
