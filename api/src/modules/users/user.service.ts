import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import { UserRepository, type UserWithPurchases } from './user.repository';

type UserWriteInput = {
  name: string;
  age: number;
  purchases: Array<{ id: number }>;
};

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async findAll() {
    const users = await this.repository.findAll();
    return users.map(this.toFrontendUser);
  }

  async findById(id: number) {
    const user = await this.repository.findById(id);
    return user ? this.toFrontendUser(user) : null;
  }

  async create(data: UserWriteInput) {
    await this.ensureProductsExist(data.purchases.map((product) => product.id));
    const user = await this.repository.create(data);
    return this.toFrontendUser(user);
  }

  async update(id: number, data: UserWriteInput) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      return null;
    }

    await this.ensureProductsExist(data.purchases.map((product) => product.id));
    const updated = await this.repository.update(id, data);
    return this.toFrontendUser(updated);
  }

  private async ensureProductsExist(productIds: number[]) {
    if (!productIds.length) {
      return;
    }

    const count = await prisma.product.count({
      where: {
        id: {
          in: productIds
        }
      }
    });

    if (count !== new Set(productIds).size) {
      throw new AppError('Um ou mais produtos informados nao existem.', 400);
    }
  }

  private toFrontendUser(user: UserWithPurchases | null) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      purchases: user.purchases.map((purchase) => purchase.product)
    };
  }
}
