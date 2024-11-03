import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('send-mail-reserva')
  reserva(@Payload() payload: any): string {
    console.log(payload);
    return this.mailerService.mailConfirmacionReserva();
  }

  @EventPattern('send-mail-registro')
  registro(@Payload() payload: any): string {
    console.log(payload);
    return this.mailerService.mailConfirmacionRegistro();
  }
}
