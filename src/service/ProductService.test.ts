import { ProductService } from './ProductService';

describe('ProductService', () => {
  it('retorna a lista de produtos', async () => {
    const service = new ProductService();

    const products = await service.getProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('name');
  });

  it('busca produto por id', async () => {
    const service = new ProductService();
    const products = await service.getProducts();
    const first = products[0];

    const product = await service.getProductById(first.id);

    expect(product).toEqual(first);
  });
});
