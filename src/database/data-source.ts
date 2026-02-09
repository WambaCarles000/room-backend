import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../ressources/users/user.entity';
import { Listing } from '../ressources/listings/listing.entity';
import { ListingImage } from '../ressources/listing-images/listing-image.entity';
import { Favorite } from '../ressources/listing-images/favorites/favorite.entity';
import { ContactRequest } from '../ressources/contact-requests/contact-request.entity';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Liste explicite des entités (plus fiable que le glob pattern)
  entities: [
    User,
    Listing,
    ListingImage,
    Favorite,
    ContactRequest,
  ],

  // Scan automatique de toutes les migrations
  migrations: [
    path.join(__dirname, '/../database/migrations/*{.ts,.js}')
  ],
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  logging: process.env.NODE_ENV === 'development',
});
