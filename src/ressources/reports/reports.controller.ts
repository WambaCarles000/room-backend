import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { User as UserDecorator } from '../../auth/user.decorator';
import { User } from '../users/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  async createReport(
    @UserDecorator() user: User,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createReport(user, createReportDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getReports(@UserDecorator() user: User) {
    return this.reportsService.getReports(user.id);
  }
}
