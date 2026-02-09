import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // Importer UsersModule pour utiliser UsersService
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}

