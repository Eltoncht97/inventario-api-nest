import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '../../common/constants';

const prisma = new PrismaClient();

export async function seedUsers() {
  await prisma.user.deleteMany();
  const users = [
    {
      name: 'Admin',
      lastname: 'Principal',
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
      status: Status.activo,
    },
    {
      name: 'Usuario',
      lastname: 'Normal',
      username: 'usuario',
      email: 'user@example.com',
      password: await bcrypt.hash('user1234', 10),
      role: Role.USER,
      status: Status.activo,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
}

// seedUsers()
//   .catch((e) => console.error(e))
//   .finally(() => void prisma.$disconnect());
