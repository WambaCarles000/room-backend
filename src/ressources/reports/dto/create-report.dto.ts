export class CreateReportDto {
  reported_user_id?: string;
  listing_id?: string;
  reason: 'spam' | 'fraud' | 'inappropriate' | 'harassment' | 'other';
  description: string;
}

export class UpdateReportStatusDto {
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes?: string;
}

export class SuspendUserDto {
  reason?: string;
}
