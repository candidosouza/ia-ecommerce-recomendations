import { ProductRepository } from './product.repository';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  findAll() {
    return this.repository.findAll();
  }

  findById(id: number) {
    return this.repository.findById(id);
  }
}
