import { Controller, Post, Patch, Body, UseGuards, Request, ForbiddenException, Req, Get } from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SupabaseAuthGuardForSignup } from 'src/auth/supabase-auth.guard-signup';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}




  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Req() req) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      phone: user.phone || null,
      is_active: user.is_active,
      role: user.role,
    };
  }

  @Post('sync')
  @UseGuards(SupabaseAuthGuardForSignup)
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
    // 'req.user' is already a User object from the database (attached by SupabaseAuthGuard)
    const user = req.user;

    // Only admins can set role to admin
    if (dto.role && dto.role === 'admin') {
      // Check if requester is admin in our DB
      if (user.role !== 'admin') {
        throw new ForbiddenException('Only admin can assign admin role');
      }
    }

    return this.usersService.updateProfile(user.id, dto);

  }
}
