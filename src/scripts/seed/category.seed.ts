import { PrismaClient } from '@prisma/client';

const nombresCategorias = [
  'Tecnología',
  'Electrodomésticos',
  'Hogar',
  'Ropa',
  'Juguetes',
  'Deportes',
  'Libros',
  'Salud',
  'Alimentos',
  'Mascotas',
];

export async function seedCategories(prisma: PrismaClient) {
  console.log('📦 Insertando categorías...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories: { id: string }[] = [];

  for (const name of nombresCategorias) {
    const category = await prisma.category.create({ data: { name } });
    createdCategories.push({ id: category.id });
  }

  return createdCategories;
}
