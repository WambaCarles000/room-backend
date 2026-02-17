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

  async syncFromSupabase(payload: any, dto: any): Promise<User> {
    const supabaseId = payload.sub;
    let user = await this.repo.findOne({ where: { supabase_id: supabaseId } });
    if (!user) {
      user = this.repo.create({
        supabase_id: supabaseId,
        email: payload.email || payload.user_email || null,
        role: dto?.role ?? UserRole.TENANT,
        first_name: dto?.first_name ?? null,
        last_name: dto?.last_name ?? null,
        phone: dto?.phone ?? null,
        is_active: true,
      });
      return this.repo.save(user);
    }

    // Update fields if provided
    let changed = false;
    if (dto?.first_name && user.first_name !== dto.first_name) {
      user.first_name = dto.first_name; changed = true;
    }
    if (dto?.last_name && user.last_name !== dto.last_name) {
      user.last_name = dto.last_name; changed = true;
    }
    if (dto?.phone && user.phone !== dto.phone) {
      user.phone = dto.phone; changed = true;
    }
    // Allow role set to owner/tenant by user, but not admin
    if (dto?.role && dto.role !== 'admin' && user.role !== dto.role) {
      user.role = dto.role as UserRole; changed = true;
    }

    if (changed) {
      user = await this.repo.save(user);
    }

    return user;
  }

  async updateProfile(id: string, dto: any): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');

    if (dto.first_name) user.first_name = dto.first_name;
    if (dto.last_name) user.last_name = dto.last_name;
    if (dto.phone) user.phone = dto.phone;
    // role changes should be validated by caller
    if (dto.role && dto.role !== user.role) user.role = dto.role;

    return this.repo.save(user);
  }
}
