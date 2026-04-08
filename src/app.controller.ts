import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { User } from './auth/user.decorator';
import { AppDataSource } from './database/data-source';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@User() user: any) {
    return user;
  }

  // Endpoint de test pour vérifier la connexion DB
  @Get('health')
  async health() {
    try {
      const isInitialized = AppDataSource.isInitialized;
      return {
        status: 'ok',
        database: {
          connected: isInitialized,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
        },
        auth: {
          jwtSecretConfigured: !!process.env.SUPABASE_JWT_SECRET,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
      };
    }
  }
}
