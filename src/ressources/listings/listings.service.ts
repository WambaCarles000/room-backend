import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Listing, ListingStatus, ListingType } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UsersService } from '../users/users.service';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';

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

    const listingData: any = {
      title: dto.title,
      description: dto.description,
      price: dto.price.toString(),
      currency: dto.currency ?? 'XAF',
      city: dto.city,
      district: dto.district,
      type: dto.type as ListingType,
      status: ListingStatus.AVAILABLE,
      owner: owner,
    };

    if (dto.square_meters) {
      listingData.square_meters = dto.square_meters.toString();
    }

    if (dto.deposit_months) {
      listingData.deposit_months = dto.deposit_months;
    }

    if (dto.availability_date) {
      listingData.availability_date = dto.availability_date;
    }

    const listing = this.repo.create(listingData);
    return this.repo.save(listing);
  }

  async updateStatus(id: string, dto: UpdateListingStatusDto, supabasePayload: any) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');

    const user = await this.usersService.findOrCreateFromSupabase(supabasePayload);

    // Autorisation: uniquement le propriétaire ou admin
    if (listing.ownerId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Not allowed to modify this listing');
    }

    if (dto.status) listing.status = dto.status as ListingStatus;
    if (dto.availability_date) listing.availability_date = dto.availability_date;

    return this.repo.save(listing);
  }
}

