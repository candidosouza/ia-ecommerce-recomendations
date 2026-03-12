import { View } from './View';
import pastPurchaseTemplate from './templates/past-purchase.html?raw';
import type { Product, User } from '../types';

type PurchaseRemovePayload = { element: HTMLElement; userId: number | null; product: Product };

export class UserView extends View {
  #userSelect = document.querySelector<HTMLSelectElement>('#userSelect');
  #userAge = document.querySelector<HTMLInputElement>('#userAge');
  #pastPurchasesList = document.querySelector<HTMLElement>('#pastPurchasesList');
  #onUserSelect?: (userId: number) => void;
  #onPurchaseRemove?: (payload: PurchaseRemovePayload) => void;

  constructor() {
    super();
    this.attachUserSelectListener();
  }

  registerUserSelectCallback(callback: (userId: number) => void) {
    this.#onUserSelect = callback;
  }

  registerPurchaseRemoveCallback(callback: (payload: PurchaseRemovePayload) => void) {
    this.#onPurchaseRemove = callback;
  }

  renderUserOptions(users: User[]) {
    if (!this.#userSelect) return;

    const options = users.map((user) => `<option value="${user.id}">${user.name}</option>`).join('');
    this.#userSelect.innerHTML = '<option value="">-- Select a user --</option>' + options;
  }

  renderUserDetails(user: User) {
    if (this.#userAge) {
      this.#userAge.value = String(user.age);
    }
  }

  renderPastPurchases(pastPurchases: Product[]) {
    if (!this.#pastPurchasesList) return;

    if (pastPurchases.length === 0) {
      this.#pastPurchasesList.innerHTML = '<p>No past purchases found.</p>';
      return;
    }

    const html = pastPurchases.map((product) =>
      this.replaceTemplate(pastPurchaseTemplate, {
        ...product,
        product: JSON.stringify(product)
      })
    ).join('');

    this.#pastPurchasesList.innerHTML = html;
    this.attachPurchaseClickHandlers();
  }

  addPastPurchase(product: Product) {
    if (!this.#pastPurchasesList) return;

    if (this.#pastPurchasesList.innerHTML.includes('No past purchases found')) {
      this.#pastPurchasesList.innerHTML = '';
    }

    const purchaseHtml = this.replaceTemplate(pastPurchaseTemplate, {
      ...product,
      product: JSON.stringify(product)
    });

    this.#pastPurchasesList.insertAdjacentHTML('afterbegin', purchaseHtml);

    const newPurchase = this.#pastPurchasesList.firstElementChild?.querySelector<HTMLElement>('.past-purchase');
    if (newPurchase) {
      newPurchase.classList.add('past-purchase-highlight');
      window.setTimeout(() => {
        newPurchase.classList.remove('past-purchase-highlight');
      }, 1000);
    }

    this.attachPurchaseClickHandlers();
  }

  private attachUserSelectListener() {
    this.#userSelect?.addEventListener('change', (event) => {
      const value = (event.target as HTMLSelectElement).value;
      const userId = value ? Number(value) : null;

      if (userId && this.#onUserSelect) {
        this.#onUserSelect(userId);
        return;
      }

      if (this.#userAge) {
        this.#userAge.value = '';
      }

      if (this.#pastPurchasesList) {
        this.#pastPurchasesList.innerHTML = '';
      }
    });
  }

  private attachPurchaseClickHandlers() {
    document.querySelectorAll<HTMLElement>('.past-purchase').forEach((purchaseElement) => {
      purchaseElement.onclick = () => {
        if (!this.#onPurchaseRemove) return;

        const product = JSON.parse(purchaseElement.dataset.product ?? '{}') as Product;
        const userId = this.getSelectedUserId();
        const element = purchaseElement.closest<HTMLElement>('.col-md-6');

        if (!element) return;

        this.#onPurchaseRemove({ element, userId, product });

        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = '0';

        window.setTimeout(() => {
          element.remove();

          if (document.querySelectorAll('.past-purchase').length === 0) {
            this.renderPastPurchases([]);
          }
        }, 500);
      };
    });
  }

  getSelectedUserId() {
    return this.#userSelect?.value ? Number(this.#userSelect.value) : null;
  }
}
