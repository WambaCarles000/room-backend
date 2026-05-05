import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../../database/data-source';
import { Favorite } from './favorite.entity';
import { Listing } from '../../listings/listing.entity';
import { User } from '../../users/user.entity';

@Injectable()
export class FavoritesService {
  private readonly repo = AppDataSource.getRepository(Favorite);
  private readonly listingRepo = AppDataSource.getRepository(Listing);
  private readonly userRepo = AppDataSource.getRepository(User);

  async addFavorite(userId: string, listingId: string): Promise<Favorite> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepo.findOne({ where: { id: userId } });
    console.log('Utilisateur trouvé:', user);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que la liste existe
    const listing = await this.listingRepo.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Annonce non trouvée');
    }

    // Vérifier que le favori n'existe pas déjà
    const existingFavorite = await this.repo.findOne({
      where: { userId, listingId },
    });

    if (existingFavorite) {
      throw new BadRequestException('Cette annonce est déjà dans vos favoris');
    }

    // Créer le favori
    const favorite = this.repo.create({
      userId,
      listingId,
    });

    return this.repo.save(favorite);
  }

  async removeFavorite(userId: string, listingId: string): Promise<void> {
    const favorite = await this.repo.findOne({
      where: { userId, listingId },
    });

    if (!favorite) {
      throw new NotFoundException('Favori non trouvé');
    }

    await this.repo.remove(favorite);
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.repo.find({
      where: { userId },
      relations: ['listing', 'listing.images', 'listing.owner'],
      order: { created_at: 'DESC' },
    });
  }

  async getUserFavoriteIds(userId: string): Promise<string[]> {
    const rows = await this.repo.find({
      where: { userId },
      select: { listingId: true },
      order: { created_at: 'DESC' },
    });
    return rows.map((r) => r.listingId).filter(Boolean);
  }

  async getListingFavorites(listingId: string): Promise<number> {
    return this.repo.count({
      where: { listingId },
    });
  }

  async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const favorite = await this.repo.findOne({
      where: { userId, listingId },
    });
    return !!favorite;
  }
}
