import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';


@Injectable()
export class SupabaseAuthGuardForSignup implements CanActivate {
  private jwksUrl: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL must be set');
    }

    const baseUrl = supabaseUrl.replace(/\/$/, '');
    this.jwksUrl = `${baseUrl}/auth/v1/.well-known/jwks.json`;
    this.jwks = createRemoteJWKSet(new URL(this.jwksUrl));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        algorithms: ['ES256'],
      });



      (request as any).user = payload;
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('JWT verification error:', error.message);
        console.error('JWKS URL:', this.jwksUrl);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}