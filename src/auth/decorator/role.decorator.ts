import { SetMetadata } from '@nestjs/common';
import { RequiredPermission } from 'src/utils/constants';

export const ROLES_KEY = 'roles';
export const Features = (...roles: RequiredPermission[]) =>
  SetMetadata(ROLES_KEY, roles);
