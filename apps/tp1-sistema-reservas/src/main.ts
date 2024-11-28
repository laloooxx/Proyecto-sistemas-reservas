import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger('Microservice Sistema de reservas');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.port,
      host: envs.host
    }
  })

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();

  logger.log(`Microservice sistem reservs listening on port: ${envs.port} `)
}
bootstrap();
