import { makeProduct, makeUser } from '../test/factories';
import { mountAppDom } from '../test/dom';

import { UserView } from './UserView';

describe('UserView', () => {
  beforeEach(() => {
    mountAppDom();
  });

  it('renderiza options e dispara callback na selecao', () => {
    const view = new UserView();
    const callback = vi.fn();
    view.registerUserSelectCallback(callback);
    view.renderUserOptions([makeUser()]);

    const select = document.querySelector<HTMLSelectElement>('#userSelect');
    expect(select?.options.length).toBe(2);

    if (select) {
      select.value = '1';
      select.dispatchEvent(new Event('change'));
    }

    expect(callback).toHaveBeenCalledWith(1);
  });

  it('renderiza detalhes e limpa campos quando nenhuma opcao esta selecionada', () => {
    const view = new UserView();
    view.renderUserDetails(makeUser({ age: 42 }));

    const ageInput = document.querySelector<HTMLInputElement>('#userAge');
    expect(ageInput?.value).toBe('42');

    const select = document.querySelector<HTMLSelectElement>('#userSelect');
    if (select) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }

    expect(ageInput?.value).toBe('');
  });

  it('renderiza compras passadas e permite remocao', () => {
    vi.useFakeTimers();
    const view = new UserView();
    const removeCallback = vi.fn();
    const product = makeProduct();

    view.registerPurchaseRemoveCallback(removeCallback);
    view.renderUserOptions([makeUser()]);

    const select = document.querySelector<HTMLSelectElement>('#userSelect');
    if (select) {
      select.value = '1';
    }

    view.renderPastPurchases([product]);
    document.querySelector<HTMLElement>('.past-purchase')?.click();
    vi.runAllTimers();

    expect(removeCallback).toHaveBeenCalled();
    expect(document.querySelector('#pastPurchasesList')?.textContent).toContain(
      'No past purchases found.'
    );
  });

  it('adiciona compra ao topo da lista', () => {
    vi.useFakeTimers();
    const view = new UserView();
    const product = makeProduct();

    view.renderPastPurchases([]);
    view.addPastPurchase(product);
    vi.runAllTimers();

    expect(document.querySelector('#pastPurchasesList')?.textContent).toContain(product.name);
  });
});
