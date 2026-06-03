import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { ShareService } from './share.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ListingsController],
  providers: [ListingsService, ShareService],
})
export class ListingsModule {}

