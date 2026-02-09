import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Exporter pour que d'autres modules puissent l'utiliser
})
export class UsersModule {}
