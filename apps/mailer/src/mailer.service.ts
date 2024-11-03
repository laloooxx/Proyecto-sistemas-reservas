import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  mailConfirmacionReserva(): string {
    return 'reserva departamento confirmada'    
  }
  
  mailConfirmacionRegistro(): string {
    return 'registro parcela confirmado'
  }
}
