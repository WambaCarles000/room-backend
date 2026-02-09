import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  private readonly repo = AppDataSource.getRepository(User);

  /**
   * Crée ou récupère un utilisateur depuis le payload JWT Supabase.
   * Le payload contient `sub` (ID Supabase) et `email`.
   */
  async findOrCreateFromSupabase(payload: any): Promise<User> {
    const supabaseId = payload.sub; // ID Supabase
    const email = payload.email || payload.user_email || null;

    // Chercher l'utilisateur existant
    let user = await this.repo.findOne({
      where: { supabase_id: supabaseId },
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
      user = this.repo.create({
        supabase_id: supabaseId,
        email: email,
        role: UserRole.TENANT, // Par défaut
      });
      user = await this.repo.save(user);
    } else if (email && user.email !== email) {
      // Mettre à jour l'email si il a changé
      user.email = email;
      user = await this.repo.save(user);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }
}
