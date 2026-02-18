import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { SupabaseAuthGuard } from '../../../auth/supabase-auth.guard';
import { UsersService } from '../../users/users.service';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly usersService: UsersService,
  ) {}

  @Post(':listingId')
  @UseGuards(SupabaseAuthGuard)
  async addFavorite(@Param('listingId') listingId: string, @Request() req: any) {
    // 'req.user' is already a User object from the database (attached by SupabaseAuthGuard)
    return this.favoritesService.addFavorite(req.user.id, listingId);
  }

  @Delete(':listingId')
  @UseGuards(SupabaseAuthGuard)
  async removeFavorite(@Param('listingId') listingId: string, @Request() req: any) {
    // 'req.user' is already a User object from the database (attached by SupabaseAuthGuard)
    await this.favoritesService.removeFavorite(req.user.id, listingId);
    return { message: 'Favori supprimé avec succès' };
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getUserFavorites(@Request() req: any) {
    // 'req.user' is already a User object from the database (attached by SupabaseAuthGuard)
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Get('check/:listingId')
  @UseGuards(SupabaseAuthGuard)
  async checkFavorite(@Param('listingId') listingId: string, @Request() req: any) {
    // 'req.user' is already a User object from the database (attached by SupabaseAuthGuard)
    const isFavorite = await this.favoritesService.isFavorite(req.user.id, listingId);
    return { isFavorite };
  }

  @Get('count/:listingId')
  async getListingFavoriteCount(@Param('listingId') listingId: string) {
    const count = await this.favoritesService.getListingFavorites(listingId);
    return { count };
  }
}
