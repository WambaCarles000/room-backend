import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportStatusDto, SuspendUserDto } from './dto/create-report.dto';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { User as UserDecorator } from '../../auth/user.decorator';
import { User, UserRole } from '../users/user.entity';

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
    return this.reportsService.getReports(user);
  }

  @Patch(':id/status')
  @UseGuards(SupabaseAuthGuard)
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
    @UserDecorator() user: User,
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update report status');
    }
    return this.reportsService.updateReportStatus(
      reportId,
      updateReportStatusDto.status,
      updateReportStatusDto.admin_notes,
    );
  }

  @Post(':id/suspend-user')
  @UseGuards(SupabaseAuthGuard)
  async suspendUser(
    @Param('id') reportId: string,
    @UserDecorator() user: User,
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can suspend users');
    }
    return this.reportsService.suspendUser(reportId, user);
  }
}
