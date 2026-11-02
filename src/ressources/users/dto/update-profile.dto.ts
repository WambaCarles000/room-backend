export class UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
  phone?: string;
  email?: string;
  role?: 'owner' | 'tenant' | 'admin';
}
