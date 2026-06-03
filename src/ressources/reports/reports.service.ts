import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Report } from './report.entity';
import { User, UserRole } from '../users/user.entity';
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

  async getReports(requestingUser: User): Promise<Report[]> {
    // If user is admin, return all reports. Otherwise only reports created by the user.
    if (requestingUser.role === UserRole.ADMIN) {
      return this.reportsRepository.find({ order: { created_at: 'DESC' } });
    }

    return this.reportsRepository.find({
      where: { reported_by: { id: requestingUser.id } },
      order: { created_at: 'DESC' },
    });
  }

  async updateReportStatus(
    reportId: string,
    status: string,
    admin_notes?: string,
  ): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
    });
    if (!report) {
      throw new BadRequestException('Report not found');
    }

    report.status = status;
    if (admin_notes !== undefined) {
      report.admin_notes = admin_notes;
    }

    return await this.reportsRepository.save(report);
  }

  async suspendUser(
    reportId: string,
    requestingUser: User,
  ): Promise<{ success: boolean; message: string }> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: { reported_user: true },
    });

    if (!report) {
      throw new BadRequestException('Report not found');
    }

    if (!report.reported_user) {
      throw new BadRequestException('This report is about a listing, not a user');
    }

    // Suspend the user
    const userToSuspend = report.reported_user;
    userToSuspend.is_active = false;
    await this.usersRepository.save(userToSuspend);

    // Update report status
    report.status = 'resolved';
    report.admin_notes = `User ${userToSuspend.email} has been suspended by admin.`;
    await this.reportsRepository.save(report);

    return {
      success: true,
      message: `User ${userToSuspend.email} has been suspended.`,
    };
  }
}
