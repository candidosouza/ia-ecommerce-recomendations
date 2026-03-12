import { View } from './View';
import productTemplate from './templates/product-card.html?raw';
import type { Product, User } from '../types';

export class ProductView extends View {
  #productList = document.querySelector<HTMLElement>('#productList');
  #buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.buy-now-btn');
  #onBuyProduct?: (product: Product) => void;

  onUserSelected(user: User) {
    this.setButtonsState(!user.id);
  }

  registerBuyProductCallback(callback: (product: Product) => void) {
    this.#onBuyProduct = callback;
  }

  render(products: Product[], disableButtons = true) {
    if (!this.#productList) return;

    const html = products.map((product) =>
      this.replaceTemplate(productTemplate, {
        ...product,
        product: JSON.stringify(product)
      })
    ).join('');

    this.#productList.innerHTML = html;
    this.attachBuyButtonListeners();
    this.setButtonsState(disableButtons);
  }

  private setButtonsState(disabled: boolean) {
    this.#buttons = document.querySelectorAll<HTMLButtonElement>('.buy-now-btn');
    this.#buttons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  private attachBuyButtonListeners() {
    this.#buttons = document.querySelectorAll<HTMLButtonElement>('.buy-now-btn');

    this.#buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const product = JSON.parse(button.dataset.product ?? '{}') as Product;
        const originalText = button.innerHTML;

        button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Added';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');

        window.setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('btn-success');
          button.classList.add('btn-primary');
        }, 500);

        this.#onBuyProduct?.(product);
      });
    });
  }
}
