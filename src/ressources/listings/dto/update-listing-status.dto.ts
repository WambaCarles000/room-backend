export class UpdateListingStatusDto {
  status?: 'available' | 'sold' | 'rented' | 'taken';
  availability_date?: Date;
}
