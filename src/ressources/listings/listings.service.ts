import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Listing, ListingStatus, ListingType } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UsersService } from '../users/users.service';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Report } from '../reports/report.entity';
import { ListingImage } from '../listing-images/listing-image.entity';

@Injectable()
export class ListingsService {
  private readonly repo = AppDataSource.getRepository(Listing);
  private readonly imageRepo = AppDataSource.getRepository(ListingImage);

  constructor(private readonly usersService: UsersService) {}

  async findAll() {
    // Récupération des listings avec propriétaire et images
    const listings = await this.repo.find({
      order: { created_at: 'DESC' },
      relations: ['images', 'owner'],
    });

    // Extraire les IDs uniques des propriétaires
    const ownerIds = Array.from(
      new Set(
        listings
          .map((l) => l.owner?.id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    if (!ownerIds.length) {
      return listings;
    }

    const reportsRepo = AppDataSource.getRepository(Report);

    // Compter le nombre total d'annonces par propriétaire
    const totalListingsRaw = await this.repo
      .createQueryBuilder('listing')
      .select('listing.ownerId', 'ownerId')
      .addSelect('COUNT(*)', 'total')
      .where('listing.ownerId IN (:...ownerIds)', { ownerIds })
      .groupBy('listing.ownerId')
      .getRawMany();

    // Compter le nombre d'annonces louées par propriétaire
    const rentedListingsRaw = await this.repo
      .createQueryBuilder('listing')
      .select('listing.ownerId', 'ownerId')
      .addSelect('COUNT(*)', 'total')
      .where('listing.ownerId IN (:...ownerIds)', { ownerIds })
      .andWhere('listing.status = :status', { status: ListingStatus.RENTED })
      .groupBy('listing.ownerId')
      .getRawMany();

    // Compter le nombre d'annonces réservées par propriétaire
    const takenListingsRaw = await this.repo
      .createQueryBuilder('listing')
      .select('listing.ownerId', 'ownerId')
      .addSelect('COUNT(*)', 'total')
      .where('listing.ownerId IN (:...ownerIds)', { ownerIds })
      .andWhere('listing.status = :status', { status: ListingStatus.TAKEN })
      .groupBy('listing.ownerId')
      .getRawMany();

    // Compter le nombre d'annonces vendues par propriétaire
    const soldListingsRaw = await this.repo
      .createQueryBuilder('listing')
      .select('listing.ownerId', 'ownerId')
      .addSelect('COUNT(*)', 'total')
      .where('listing.ownerId IN (:...ownerIds)', { ownerIds })
      .andWhere('listing.status = :status', { status: ListingStatus.SOLD })
      .groupBy('listing.ownerId')
      .getRawMany();

    // Compter le nombre de signalements par propriétaire (en tant qu'utilisateur signalé)
    const reportsRaw = await reportsRepo
      .createQueryBuilder('report')
      .select('report.reported_user_id', 'userId')
      .addSelect('COUNT(*)', 'total')
      .where('report.reported_user_id IN (:...ownerIds)', { ownerIds })
      .groupBy('report.reported_user_id')
      .getRawMany();

    const totalListingsMap = new Map<string, number>(
      totalListingsRaw.map((r: any) => [r.ownerId, Number(r.total)]),
    );
    const rentedListingsMap = new Map<string, number>(
      rentedListingsRaw.map((r: any) => [r.ownerId, Number(r.total)]),
    );
    const takenListingsMap = new Map<string, number>(
      takenListingsRaw.map((r: any) => [r.ownerId, Number(r.total)]),
    );
    const soldListingsMap = new Map<string, number>(
      soldListingsRaw.map((r: any) => [r.ownerId, Number(r.total)]),
    );
    const reportsMap = new Map<string, number>(
      reportsRaw.map((r: any) => [r.userId, Number(r.total)]),
    );

    // Enrichir les objets owner renvoyés avec les compteurs de fiabilité
    return listings.map((listing) => {
      const anyOwner = listing.owner as any;
      if (anyOwner?.id) {
        anyOwner.total_listings = totalListingsMap.get(anyOwner.id) ?? 0;
        anyOwner.rented_listings = rentedListingsMap.get(anyOwner.id) ?? 0;
        anyOwner.taken_listings = takenListingsMap.get(anyOwner.id) ?? 0;
        anyOwner.sold_listings = soldListingsMap.get(anyOwner.id) ?? 0;
        anyOwner.reports_count = reportsMap.get(anyOwner.id) ?? 0;
      }
      return listing;
    });
  }

  async create(dto: CreateListingDto, owner: any) {
    // 'owner' is already a User object from the database (passed by SupabaseAuthGuard via @User() decorator)
    if (!owner?.id) {
      throw new Error('Owner must be authenticated. Ensure /users/sync was called first.');
    }
    // Phone is required at publish time (not at signup)
    if (!owner?.phone) {
      throw new BadRequestException(
        'Veuillez ajouter votre numéro de téléphone dans votre profil avant de publier une annonce.',
      );
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

  async addImages(listingId: string, imageUrls: string[], user: any) {
    const listing = await this.repo.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Autorisation: uniquement le propriétaire ou admin
    if (listing.ownerId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Not allowed to modify this listing');
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return [];
    }

    // Limiter le nombre d'images par annonce (ex: 10 max)
    const existingCount = await this.imageRepo.count({ where: { listing: { id: listingId } } });
    const availableSlots = Math.max(10 - existingCount, 0);
    const urlsToSave = imageUrls.slice(0, availableSlots);

    const images = urlsToSave.map((url, index) => {
      const img = new ListingImage();
      img.imageUrl = url;
      img.listing = listing;
      img.order = existingCount + index;
      img.is_active = true;
      return img;
    });

    return this.imageRepo.save(images);
  }


  
  async findUserListings(userId: string) {
    return this.repo.find({
      where: { owner: { id: userId } },
      order: { created_at: 'DESC' },
      relations: ['images'],
    });
  }
}

