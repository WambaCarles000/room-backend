import { Body, Controller, Get, Post, UseGuards, Param, Patch } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ShareService, ShareData } from './share.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { User } from '../../auth/user.decorator';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly shareService: ShareService,
  ) {}

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Body() dto: CreateListingDto, @User() user: any) {
    return this.listingsService.create(dto, user);
  }

  @Patch(':id/status')
  @UseGuards(SupabaseAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateListingStatusDto,
    @User() user: any,
  ) {
    return this.listingsService.updateStatus(id, dto, user);
  }

  @Get(':id/share-data/:platform')
  async getShareData(
    @Param('id') listingId: string,
    @Param('platform') platform: string,
  ): Promise<{ listing: ShareData; metaTags: string; shareUrl: string }> {
    const shareData = await this.shareService.generateShareData(listingId, platform);
    const metaTags = this.shareService.generateMetaTags(shareData);
    const shareUrl = this.shareService.generateShareUrl(shareData);

    return {
      listing: shareData,
      metaTags,
      shareUrl,
    };
  }

  @Get(':id/share-url/:platform')
  async getShareUrl(
    @Param('id') listingId: string,
    @Param('platform') platform: string,
  ): Promise<{ shareUrl: string }> {
    const shareData = await this.shareService.generateShareData(listingId, platform);
    const shareUrl = this.shareService.generateShareUrl(shareData);

    return { shareUrl };
  }

  @Post(':id/share')
  async trackShare(
    @Param('id') listingId: string,
    @Body() dto: CreateShareDto,
  ) {
    await this.shareService.trackShare(listingId, dto.platform);
    return { message: 'Partage enregistré' };
  }
}

