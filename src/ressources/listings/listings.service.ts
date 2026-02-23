import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Listing, ListingStatus, ListingType } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UsersService } from '../users/users.service';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

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

  async create(dto: CreateListingDto, owner: any) {
    // 'owner' is already a User object from the database (passed by SupabaseAuthGuard via @User() decorator)
    if (!owner?.id) {
      throw new Error('Owner must be authenticated. Ensure /users/sync was called first.');
    }

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

  async updateStatus(id: string, dto: UpdateListingStatusDto, user: any) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');

    // 'user' is already a User object from the database (passed by SupabaseAuthGuard via @User() decorator)
    // Autorisation: uniquement le propriétaire ou admin
    if (listing.ownerId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Not allowed to modify this listing');
    }

    if (dto.status) listing.status = dto.status as ListingStatus;
    if (dto.availability_date) listing.availability_date = dto.availability_date;

    return this.repo.save(listing);
  }

  async updateListing(id: string, dto: UpdateListingDto, user: any) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');

    // 'user' is already a User object from the database (passed by SupabaseAuthGuard via @User() decorator)
    // Autorisation: uniquement le propriétaire ou admin
    if (listing.ownerId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Not allowed to modify this listing');
    }

    // Mettre à jour tous les champs fournis
    if (dto.title !== undefined) listing.title = dto.title;
    if (dto.description !== undefined) listing.description = dto.description;
    if (dto.price !== undefined) listing.price = dto.price.toString();
    if (dto.type !== undefined) listing.type = dto.type as ListingType;
    if (dto.city !== undefined) listing.city = dto.city;
    if (dto.district !== undefined) listing.district = dto.district;
    if (dto.square_meters !== undefined && dto.square_meters) {
      listing.square_meters = dto.square_meters.toString();
    }
    if (dto.deposit_months !== undefined) listing.deposit_months = dto.deposit_months;
    if (dto.status !== undefined) listing.status = dto.status as ListingStatus;
    if (dto.availability_date !== undefined) listing.availability_date = dto.availability_date;

    listing.updated_at = new Date();
    return this.repo.save(listing);
  }

  async findUserListings(userId: string) {
    return this.repo.find({
      where: { owner: { id: userId } },
      order: { created_at: 'DESC' },
      relations: ['images'],
    });
  }
}

