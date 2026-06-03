export class UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  type?: 'studio' | 'chambre' | 'appartement';
  city?: string;
  district?: string;
  square_meters?: number;
  deposit_months?: number;
  status?: 'available' | 'sold' | 'rented' | 'taken';
  availability_date?: Date;
}
