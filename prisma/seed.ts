import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    'Electronics',
    'Books',
    'Home & Kitchen',
    'Toys',
    'Sports',
    'Clothing',
    'Shoes',
    'Beauty',
    'Health',
    'Automotive',
    'Garden',
    'Music',
    'Office',
    'Pet Supplies',
    'Tools',
  ];

  for (const name of categories) {
    await prisma.category.create({
      data: { name },
    });
  }

  console.log('✅ Categories seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
