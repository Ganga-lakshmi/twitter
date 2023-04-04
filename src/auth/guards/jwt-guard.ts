import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RequiredPermission } from 'src/utils/constants';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requiredFeatures = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const isPublic = requiredFeatures.includes(RequiredPermission.Guest);
    if (request.headers.authorization === undefined && isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          is_success: false,
          message: 'Access Denied.',
        })
      );
    }
    return user;
  }
}
