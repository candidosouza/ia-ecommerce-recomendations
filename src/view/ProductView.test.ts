import { makeProduct, makeUser } from '../test/factories';
import { mountAppDom } from '../test/dom';

import { ProductView } from './ProductView';

describe('ProductView', () => {
  beforeEach(() => {
    mountAppDom();
  });

  it('renderiza produtos e controla disabled dos botoes', () => {
    const view = new ProductView();
    const callback = vi.fn();
    view.registerBuyProductCallback(callback);

    view.render([makeProduct()], true);

    const button = document.querySelector<HTMLButtonElement>('.buy-now-btn');
    expect(button).not.toBeNull();
    expect(button?.disabled).toBe(true);

    view.onUserSelected(makeUser());
    expect(button?.disabled).toBe(false);
  });

  it('dispara callback ao clicar em comprar', () => {
    vi.useFakeTimers();
    const view = new ProductView();
    const product = makeProduct();
    const callback = vi.fn();
    view.registerBuyProductCallback(callback);
    view.render([product], false);

    const button = document.querySelector<HTMLButtonElement>('.buy-now-btn');
    button?.click();
    vi.runAllTimers();

    expect(callback).toHaveBeenCalledWith(product);
  });
});
