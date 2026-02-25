import 'reflect-metadata';
import { AppDataSource } from '../src/database/data-source';
import { User, UserRole } from '../src/ressources/users/user.entity';

async function main() {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};
  args.forEach((arg) => {
    const [k, v] = arg.split('=');
    if (k && v) params[k.replace(/^--/, '')] = v;
  });

  const email = params.email;
  const id = params.id;

  if (!email && !id) {
    console.error('Usage: ts-node tools/promote-admin.ts --email=you@example.com OR --id=uuid');
    process.exit(1);
  }

  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const user = email
      ? await repo.findOne({ where: { email } })
      : await repo.findOne({ where: { id } });

    if (!user) {
      console.error('User not found');
      process.exit(2);
    }

    user.role = UserRole.ADMIN;
    await repo.save(user);

    console.log(`User promoted to admin: ${user.id} (${user.email})`);
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err: any) {
    console.error('Error promoting user:', err?.message || err);
    try {
      await AppDataSource.destroy();
    } catch {}
    process.exit(3);
  }
}

main();
