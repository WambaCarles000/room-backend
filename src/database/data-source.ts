import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../ressources/users/user.entity';
import { Listing } from '../ressources/listings/listing.entity';
import { ListingImage } from '../ressources/listing-images/listing-image.entity';
import { Favorite } from '../ressources/listing-images/favorites/favorite.entity';
import { ContactRequest } from '../ressources/contact-requests/contact-request.entity';
import { Report } from '../ressources/reports/report.entity';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.DB_SSL === 'true' ||
  (databaseUrl?.includes('supabase.co') ?? false) ||
  process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? {
        url: databaseUrl,
        ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
      }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
      }),
  // Liste explicite des entités (plus fiable que le glob pattern)
  entities: [
    User,
    Listing,
    ListingImage,
    Favorite,
    ContactRequest,
    Report,
  ],

  // Scan automatique de toutes les migrations
  migrations: [
    path.join(__dirname, '/../database/migrations/*{.ts,.js}')
  ],
  synchronize: false, // Désactivation de la synchronisation automatique
  logging: process.env.NODE_ENV === 'development',
});
