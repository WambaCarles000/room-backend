import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AppDataSource } from '../database/data-source';
import { User } from '../ressources/users/user.entity';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwksUrl: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error('SUPABASE_URL must be set');
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    this.jwksUrl = `${baseUrl}/auth/v1/.well-known/jwks.json`;
    this.jwks = createRemoteJWKSet(new URL(this.jwksUrl));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();


    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token');

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      const { payload } = await jwtVerify(token, this.jwks, { algorithms: ['ES256'] });

      const usersRepository = AppDataSource.getRepository(User);
      const dbUser = await usersRepository.findOne({ where: { supabase_id: payload.sub as string } });
      if (!dbUser) throw new UnauthorizedException('User not synced. Call /users/sync first.');
        if (!dbUser.is_active) {
     
        response.status(401).json({
          statusCode: 401,
          message: 'Your account has been suspended.',
          code: 'ACCOUNT_SUSPENDED',
        });
        console.warn(`Suspended user ${dbUser.id} attempted to authenticate.`);
        return false;
      }
      request.user = dbUser; // Entity DB attachée
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('JWT verification error:', err.message);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}