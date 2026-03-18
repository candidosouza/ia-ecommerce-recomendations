import { apiClient } from './apiClient';

import type { Product } from '../types';

export class ProductService {
  async getProducts() {
    return apiClient<Product[]>('/products');
  }

  async getProductById(id: number) {
    return apiClient<Product>(`/products/${id}`);
  }

  async getProductsByIds(ids: number[]) {
    const products = await this.getProducts();
    return products.filter((product) => ids.includes(product.id));
  }
}
