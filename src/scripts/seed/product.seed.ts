import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedProducts(
  prisma: PrismaClient,
  categories: { id: string }[],
) {
  console.log('📦 Insertando productos...');
  await prisma.product.deleteMany();

  const productsData: Prisma.ProductCreateManyInput[] = [];

  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories);
    const cost = Number(faker.commerce.price({ min: 100, max: 1000, dec: 2 }));
    const ivaValue = +(cost * 0.21).toFixed(2);
    const costTotal = +(cost + ivaValue).toFixed(2);
    const price = +(costTotal * 1.2).toFixed(2);

    productsData.push({
      code: `P-${i + 1}`,
      name: faker.commerce.productName(), // podría dejarlo en inglés si no afecta
      description: `Producto ideal para ${faker.commerce.department().toLowerCase()}`,
      stock: faker.number.int({ min: 0, max: 100 }),
      stockMin: faker.number.int({ min: 0, max: 10 }),
      cost,
      ivaType: 'IVA_21',
      ivaValue,
      costTotal,
      discountPercent: 0,
      discountValue: 0,
      utilitiesPercent: 20,
      utilitiesValue: +(price - costTotal).toFixed(2),
      price,
      categoryId: category.id,
    });
  }

  await prisma.product.createMany({ data: productsData });

  console.log('✅ 50 productos creados');
}
