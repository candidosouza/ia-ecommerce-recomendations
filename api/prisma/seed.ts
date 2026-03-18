import { faker } from '@faker-js/faker';

import productsData from '../../data/products.json';
import usersData from '../../data/users.json';
import { prisma } from '../src/lib/prisma';

type ProductSeed = (typeof productsData)[number];
type UserSeed = (typeof usersData)[number];

async function resetDatabase() {
  await prisma.purchase.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
}

async function seedProducts() {
  const categories = ['eletronicos', 'vestuario', 'calcados', 'acessorios', 'casa'];
  const colors = ['preto', 'azul', 'branco', 'cinza', 'verde', 'vermelho'];

  const baseProducts = productsData.map((product) => ({
    ...product,
    category: normalizeCategory(product.category),
    color: product.color.toLowerCase()
  }));

  const generatedProducts = Array.from({ length: 8 }, (_, index) => ({
    id: baseProducts.length + index + 1,
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: Number(faker.commerce.price({ min: 35, max: 320 })),
    color: faker.helpers.arrayElement(colors)
  }));

  const products = [...baseProducts, ...generatedProducts];

  await prisma.product.createMany({
    data: products
  });

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 1), true);`
  );

  return products;
}

async function seedUsers(products: ProductSeed[]) {
  const baseUsers = usersData.map((user) => ({
    id: user.id,
    name: user.name,
    age: user.age,
    purchases: user.purchases.map((purchase) => purchase.id)
  }));

  const generatedUsers = Array.from({ length: 10 }, (_, index) => {
    const purchases = faker.helpers.arrayElements(products, {
      min: 1,
      max: 4
    });

    return {
      id: baseUsers.length + index + 1,
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 55 }),
      purchases: purchases.map((product) => product.id)
    };
  });

  const users = [...baseUsers, ...generatedUsers];

  await prisma.user.createMany({
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      age: user.age
    }))
  });

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1), true);`
  );

  await prisma.purchase.createMany({
    data: users.flatMap((user) =>
      user.purchases.map((productId) => ({
        userId: user.id,
        productId
      }))
    )
  });
}

function normalizeCategory(category: string) {
  return category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

async function main() {
  await resetDatabase();
  const products = await seedProducts();
  await seedUsers(products);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
