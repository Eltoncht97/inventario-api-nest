import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
