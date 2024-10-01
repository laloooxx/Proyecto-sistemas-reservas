import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { on } from 'events';
import { Observable } from 'rxjs';

/**@Injectable()
export class RoleGuardsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  //decimos quien puede activar la ruta y quien no
  canActivate(
    context: ExecutionContext,
    Roles: string
  ):Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if(!roles) {
    }
  }
} */
