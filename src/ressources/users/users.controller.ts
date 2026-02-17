import { Controller, Post, Patch, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(SupabaseAuthGuard)
  async syncUser(@Body() dto: SyncUserDto, @Request() req: any) {
    console.log('POST /users/sync called with:', {
      payload_sub: req.user?.sub,
      payload_email: req.user?.email,
      dto,
    });
    const result = await this.usersService.syncFromSupabase(req.user, dto);
    console.log('User synced:', result);
    return result;
  }

  @Patch('me')
  @UseGuards(SupabaseAuthGuard)
  async updateMe(@Body() dto: UpdateProfileDto, @Request() req: any) {
    const payloadUser = req.user;
    const user = await this.usersService.findOrCreateFromSupabase(payloadUser);

    // Only admins can set role to admin
    if (dto.role && dto.role === 'admin') {
      // check if requester is admin in our DB
      const requester = await this.usersService.findOrCreateFromSupabase(payloadUser);
      if (requester.role !== 'admin') {
        throw new ForbiddenException('Only admin can assign admin role');
      }
    }

    return this.usersService.updateProfile(user.id, dto);
  }
}
