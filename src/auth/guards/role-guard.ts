import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequiredPermission } from './../../utils/constants';
//import { UserOrganizationRoleService } from 'src/user-organization-role/user-organization-role.service';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //private userOrganizationRoleService: UserOrganizationRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeatures = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = requiredFeatures.includes(RequiredPermission.Guest);
    const isUsers = requiredFeatures.includes(RequiredPermission.Users);
    const isPosts = requiredFeatures.includes(RequiredPermission.Posts);
    const request = context.switchToHttp().getRequest();

    if (isPublic) {
      return true;
    }
    if ((request.headers.authorization && isUsers) || isPosts) {
      return true;
    }

    const { id, activeOrganization } = request.user;
    // const features =
    //   await this.userOrganizationRoleService.getFeaturesByUserIdOrganizationId(
    //     id,
    //     activeOrganization,
    //   );

    // return requiredFeatures.every((feature) => features.includes(feature));
    console.log(
      requiredFeatures.every((role) => request.roles?.includes(role)),
    );
    return requiredFeatures.every((role) => request.roles?.includes(role));
  }
}
