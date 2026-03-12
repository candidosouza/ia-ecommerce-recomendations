import productsData from '../../data/products.json';
import type { Product } from '../types';

export class ProductService {
  async getProducts() {
    return structuredClone(productsData) as Product[];
  }

  async getProductById(id: number) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async getProductsByIds(ids: number[]) {
    const products = await this.getProducts();
    return products.filter((product) => ids.includes(product.id));
  }
}
