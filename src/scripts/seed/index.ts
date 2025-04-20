import { PrismaClient } from '@prisma/client';
import { seedCategories } from './category.seed';
import { seedProducts } from './product.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo...');

  // Ejecutar cada seed de forma controlada
  const categories = await seedCategories(prisma);
  await seedProducts(prisma, categories);

  console.log('✅ Seed finalizado con éxito');
}

main()
  .catch((err) => {
    console.error('❌ Error en el seed:', err);
    process.exit(1);
  })
  .finally(() => {
    // ❗ sin async acá para evitar error de eslint
    prisma.$disconnect();
  });
