export class CreateListingDto {
  title: string;
  description: string;
  price: number;
  currency?: string;
  city: string;
  district: string;
  type: string; // ListingType côté entity; on garde string pour rester simple via le body JSON.
}

