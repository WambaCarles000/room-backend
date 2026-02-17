import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { User } from '../../auth/user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}


  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Body() dto: CreateListingDto, @User() user: any) {
    return this.listingsService.create(dto, user);
  }
}

