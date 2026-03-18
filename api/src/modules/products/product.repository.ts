import { prisma } from '../../lib/prisma';

export class ProductRepository {
  async findAll() {
    return prisma.product.findMany({
      orderBy: { id: 'asc' }
    });
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id }
    });
  }
}
