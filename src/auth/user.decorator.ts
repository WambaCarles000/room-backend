import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Récupère le payload du JWT Supabase injecté par SupabaseAuthGuard.
 *
 * Exemple:
 *   @Get('me')
 *   @UseGuards(SupabaseAuthGuard)
 *   getMe(@User() user: any) {
 *     return user;
 *   }
 */
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

