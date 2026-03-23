import { ProductService } from './ProductService';
import { makeProduct } from '../test/factories';

describe('ProductService', () => {
  it('retorna a lista de produtos', async () => {
    const service = new ProductService();
    const productsPayload = [makeProduct()];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(productsPayload), {
          status: 200
        })
      )
    );

    const products = await service.getProducts();

    expect(products).toEqual(productsPayload);
  });

  it('busca produto por id', async () => {
    const service = new ProductService();
    const first = makeProduct();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(first), {
          status: 200
        })
      )
    );

    const product = await service.getProductById(first.id);

    expect(product).toEqual(first);
  });
});
