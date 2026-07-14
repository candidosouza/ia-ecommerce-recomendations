export class AppFeedbackView {
  #container = document.querySelector<HTMLElement>('#appFeedback');

  showError(message: string) {
    if (!this.#container) return;

    this.#container.innerHTML = `
      <div class="alert alert-danger app-alert" role="alert">
        <strong>Erro:</strong> ${message}
      </div>
    `;
  }

  clear() {
    if (!this.#container) return;
    this.#container.innerHTML = '';
  }
}
