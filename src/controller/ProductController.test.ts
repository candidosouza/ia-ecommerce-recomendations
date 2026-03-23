import { makeProduct, makeUser } from '../test/factories';

import { ProductController } from './ProductController';

describe('ProductController', () => {
  it('carrega produtos na inicializacao', async () => {
    const products = [makeProduct()];
    const productView = {
      registerBuyProductCallback: vi.fn(),
      render: vi.fn(),
      onUserSelected: vi.fn()
    };
    const productService = {
      getProducts: vi.fn().mockResolvedValue(products)
    };
    const events = {
      onUserSelected: vi.fn(),
      onRecommendationsReady: vi.fn(),
      dispatchRecommend: vi.fn(),
      dispatchPurchaseAdded: vi.fn()
    };

    ProductController.init({
      productView: productView as never,
      productService: productService as never,
      events: events as never
    });

    await Promise.resolve();

    expect(productView.registerBuyProductCallback).toHaveBeenCalled();
    expect(productView.render).toHaveBeenCalledWith(products, true);
  });

  it('despacha recommend ao selecionar usuario e purchase:added ao comprar', async () => {
    const product = makeProduct();
    const user = makeUser();
    const productView = {
      registerBuyProductCallback: vi.fn(),
      render: vi.fn(),
      onUserSelected: vi.fn()
    };
    const productService = {
      getProducts: vi.fn().mockResolvedValue([product])
    };
    const events = {
      onUserSelected: vi.fn(),
      onRecommendationsReady: vi.fn(),
      dispatchRecommend: vi.fn(),
      dispatchPurchaseAdded: vi.fn()
    };

    ProductController.init({
      productView: productView as never,
      productService: productService as never,
      events: events as never
    });

    await Promise.resolve();

    const onUserSelected = events.onUserSelected.mock.calls[0][0];
    onUserSelected(user);

    expect(productView.onUserSelected).toHaveBeenCalledWith(user);
    expect(events.dispatchRecommend).toHaveBeenCalledWith(user);

    const onBuy = productView.registerBuyProductCallback.mock.calls[0][0];
    await onBuy(product);

    expect(events.dispatchPurchaseAdded).toHaveBeenCalledWith({ user, product });
  });
});
