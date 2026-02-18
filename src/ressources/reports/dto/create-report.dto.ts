export class CreateReportDto {
  reported_user_id?: string;
  listing_id?: string;
  reason: 'spam' | 'fraud' | 'inappropriate' | 'harassment' | 'other';
  description: string;
}
