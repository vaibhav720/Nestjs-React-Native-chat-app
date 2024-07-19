import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';

/**
 * AuthGuard for protected routes
 * @description This AuthGuard is aimed to be used
 * in whole BE for protected routes
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) return false;

    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService
      .send(
        {
          cmd: 'verify-jwt',
        },
        {
          jwt,
        },
      )
      .pipe(
        switchMap(({ exp }: any) => {
          if (!exp) return of(false);

          const TOKEN_EXP_MS = exp * 1000;
          const isJwtValid = Date.now() < TOKEN_EXP_MS;
          return of(isJwtValid);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }
}
