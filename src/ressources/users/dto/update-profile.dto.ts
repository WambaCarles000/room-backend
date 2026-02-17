export class UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'owner' | 'tenant' | 'admin';
}
