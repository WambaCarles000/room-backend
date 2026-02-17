export class SyncUserDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'owner' | 'tenant' | 'admin';
}
