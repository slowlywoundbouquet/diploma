import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private roles: string[] | null) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
