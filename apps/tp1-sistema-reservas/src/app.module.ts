import { Module } from '@nestjs/common';
import { ReservasModule } from './sist_reservas/reservas.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/dbConfig';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(dbConfig),
    ReservasModule
  ],
})
export class AppModule {}
