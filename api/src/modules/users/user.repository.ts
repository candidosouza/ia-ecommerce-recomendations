import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';

type UserWriteInput = {
  name: string;
  age: number;
  purchases: Array<{ id: number }>;
};

export type UserWithPurchases = Prisma.UserGetPayload<{
  include: {
    purchases: {
      include: {
        product: true;
      };
    };
  };
}>;

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: {
        purchases: {
          orderBy: { id: 'asc' },
          include: {
            product: true
          }
        }
      }
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        purchases: {
          orderBy: { id: 'asc' },
          include: {
            product: true
          }
        }
      }
    });
  }

  async create(data: UserWriteInput) {
    return prisma.user.create({
      data: {
        name: data.name,
        age: data.age,
        purchases: {
          create: data.purchases.map((product) => ({
            productId: product.id
          }))
        }
      },
      include: {
        purchases: {
          orderBy: { id: 'asc' },
          include: {
            product: true
          }
        }
      }
    });
  }

  async update(id: number, data: UserWriteInput) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        age: data.age,
        purchases: {
          deleteMany: {},
          create: data.purchases.map((product) => ({
            productId: product.id
          }))
        }
      },
      include: {
        purchases: {
          orderBy: { id: 'asc' },
          include: {
            product: true
          }
        }
      }
    });
  }
}
