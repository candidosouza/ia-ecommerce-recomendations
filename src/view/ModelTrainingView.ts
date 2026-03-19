import { View } from './View';

import type { TrainingProgress, User } from '../types';

export class ModelView extends View {
  #trainModelBtn = document.querySelector<HTMLButtonElement>('#trainModelBtn');
  #purchasesArrow = document.querySelector<HTMLElement>('#purchasesArrow');
  #purchasesDiv = document.querySelector<HTMLElement>('#purchasesDiv');
  #allUsersPurchasesList = document.querySelector<HTMLElement>('#allUsersPurchasesList');
  #runRecommendationBtn = document.querySelector<HTMLButtonElement>('#runRecommendationBtn');
  #onTrainModel?: () => void;
  #onRunRecommendation?: () => void;

  constructor() {
    super();
    this.attachEventListeners();
  }

  registerTrainModelCallback(callback: () => void) {
    this.#onTrainModel = callback;
  }

  registerRunRecommendationCallback(callback: () => void) {
    this.#onRunRecommendation = callback;
  }

  enableRecommendButton() {
    if (this.#runRecommendationBtn) {
      this.#runRecommendationBtn.disabled = false;
    }
  }

  updateTrainingProgress(progress: TrainingProgress) {
    if (!this.#trainModelBtn) return;

    this.#trainModelBtn.disabled = true;
    this.#trainModelBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Training...';

    if (progress.progress === 100) {
      this.#trainModelBtn.disabled = false;
      this.#trainModelBtn.innerHTML = 'Train Recommendation Model';
    }
  }

  renderAllUsersPurchases(users: User[]) {
    if (!this.#allUsersPurchasesList) return;

    const html = users
      .map((user) => {
        const purchasesHtml = user.purchases
          .map(
            (purchase) => `<span class="badge bg-light text-dark me-1 mb-1">${purchase.name}</span>`
          )
          .join('');

        return `
        <div class="user-purchase-summary">
          <h6>${user.name} (Age: ${user.age})</h6>
          <div class="purchases-badges">
            ${purchasesHtml || '<span class="text-muted">No purchases</span>'}
          </div>
        </div>
      `;
      })
      .join('');

    this.#allUsersPurchasesList.innerHTML = html;
  }

  private attachEventListeners() {
    this.#trainModelBtn?.addEventListener('click', () => {
      this.#onTrainModel?.();
    });

    this.#runRecommendationBtn?.addEventListener('click', () => {
      this.#onRunRecommendation?.();
    });

    this.#purchasesDiv?.addEventListener('click', () => {
      if (!this.#allUsersPurchasesList || !this.#purchasesArrow) return;

      const isHidden = window.getComputedStyle(this.#allUsersPurchasesList).display === 'none';

      if (isHidden) {
        this.#allUsersPurchasesList.style.display = 'block';
        this.#purchasesArrow.classList.remove('bi-chevron-down');
        this.#purchasesArrow.classList.add('bi-chevron-up');
        return;
      }

      this.#allUsersPurchasesList.style.display = 'none';
      this.#purchasesArrow.classList.remove('bi-chevron-up');
      this.#purchasesArrow.classList.add('bi-chevron-down');
    });
  }
}
