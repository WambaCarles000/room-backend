import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingsModule } from './ressources/listings/listings.module';
import { FavoritesModule } from './ressources/listing-images/favorites/favorites.module';

@Module({
  imports: [ListingsModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
