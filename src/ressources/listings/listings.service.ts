import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Listing, ListingStatus, ListingType } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ListingsService {
  private readonly repo = AppDataSource.getRepository(Listing);

  constructor(private readonly usersService: UsersService) {}

  async findAll() {
    return this.repo.find({
      order: { created_at: 'DESC' },
      relations: ['images', 'owner'],
    });
  }

  async create(dto: CreateListingDto, supabasePayload: any) {
    // Créer ou récupérer l'utilisateur TypeORM depuis le payload Supabase
    const owner = await this.usersService.findOrCreateFromSupabase(supabasePayload);

    const listing = this.repo.create({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      currency: dto.currency ?? 'XAF',
      city: dto.city,
      district: dto.district,
      type: dto.type as ListingType,
      status: ListingStatus.AVAILABLE,
      owner: owner, // Lier à l'utilisateur TypeORM
    });

    return this.repo.save(listing);
  }
}

