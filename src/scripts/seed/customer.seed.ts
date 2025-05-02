import { PrismaClient } from '@prisma/client';
import { customerSeedData } from './customerSeedData';

export async function seedCustomers(prisma: PrismaClient) {
  console.log('📦 Insertando clientes...');
  await prisma.customer.deleteMany(); // limpieza previa si querés

  await prisma.customer.createMany({
    data: customerSeedData, // o tipalo con Prisma.CustomerCreateManyInput[]
    skipDuplicates: true,
  });

  console.log('✅ Clientes insertados correctamente');
}
