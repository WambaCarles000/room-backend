export class CreateShareDto {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';
  message?: string;
}
