import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  private readonly reportsRepository = AppDataSource.getRepository(Report);
  private readonly usersRepository = AppDataSource.getRepository(User);
  private readonly listingsRepository = AppDataSource.getRepository(Listing);

  async createReport(
    reportedBy: User,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    // Validation: at least one of reported_user_id or listing_id is required
    if (!createReportDto.reported_user_id && !createReportDto.listing_id) {
      throw new BadRequestException(
        'Either reported_user_id or listing_id must be provided',
      );
    }

    // Validation: cannot report yourself
    if (
      createReportDto.reported_user_id &&
      createReportDto.reported_user_id === reportedBy.id
    ) {
      throw new BadRequestException(
        'You cannot report yourself',
      );
    }

    let reportedUserId: string | undefined;
    let listingId: string | undefined;

    if (createReportDto.reported_user_id) {
      const user = await this.usersRepository.findOne({
        where: { id: createReportDto.reported_user_id },
      });
      if (!user) {
        throw new BadRequestException('User to report not found');
      }
      reportedUserId = user.id;
    }

    if (createReportDto.listing_id) {
      const listing = await this.listingsRepository.findOne({
        where: { id: createReportDto.listing_id },
      });
      if (!listing) {
        throw new BadRequestException('Listing not found');
      }
      listingId = listing.id;
    }

    // Create report instance
    const report = new Report();
    report.reported_by = reportedBy;
    report.reported_user = reportedUserId ? { id: reportedUserId } as User : undefined;
    report.listing = listingId ? { id: listingId } as any : undefined;
    report.reason = createReportDto.reason;
    report.description = createReportDto.description;
    report.status = 'pending';

    return await this.reportsRepository.save(report);
  }

  async getReports(userId: string): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { reported_by: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }
}
