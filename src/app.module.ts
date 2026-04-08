import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingsModule } from './ressources/listings/listings.module';
import { FavoritesModule } from './ressources/listing-images/favorites/favorites.module';
import { ReportsModule } from './ressources/reports/reports.module';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';

@Module({
  imports: [ListingsModule, FavoritesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService, SupabaseAuthGuard],
})
export class AppModule {}
