import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Guard Nest qui vérifie un JWT Supabase envoyé par le frontend.
 *
 * Supabase utilise ES256 (Elliptic Curve) pour signer les tokens,
 * donc on doit utiliser la clé publique JWKS depuis Supabase.
 *
 * - Le frontend envoie le token dans l'en-tête:
 *     Authorization: Bearer <access_token>
 * - Le backend vérifie la signature avec la clé publique JWKS de Supabase
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwksUrl: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL must be set');
    }
    
    // Construire l'URL JWKS depuis l'URL Supabase
    // Format officiel Supabase: https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    this.jwksUrl = `${baseUrl}/auth/v1/.well-known/jwks.json`;
    
    // Créer le JWKS Set pour récupérer automatiquement les clés publiques
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
      // Vérifier le token avec la clé publique JWKS de Supabase
      const { payload } = await jwtVerify(token, this.jwks, {
        algorithms: ['ES256'], // Supabase utilise ES256
      });

      // On attache le payload au request pour l'utiliser dans les handlers.
      (request as any).user = payload;

      return true;
    } catch (error) {
      // Log l'erreur en dev pour debug
      if (process.env.NODE_ENV === 'development') {
        console.error('JWT verification error:', error.message);
        console.error('JWKS URL:', this.jwksUrl);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

