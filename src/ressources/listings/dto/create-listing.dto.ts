export class CreateListingDto {
  title: string;
  description: string;
  price: number;
  currency?: string;
  city: string;
  district: string;
  type: string;
  square_meters?: number;
  deposit_months?: number;
  availability_date?: Date;
}

