import type Events from '../events/events';
import type { AppFeedbackView } from '../view/AppFeedbackView';

export class AppFeedbackController {
  #events: typeof Events;
  #view: AppFeedbackView;

  constructor({ events, view }: { events: typeof Events; view: AppFeedbackView }) {
    this.#events = events;
    this.#view = view;
    this.init();
  }

  static init(deps: { events: typeof Events; view: AppFeedbackView }) {
    return new AppFeedbackController(deps);
  }

  private init() {
    this.#events.onAppError(({ message }) => {
      this.#view.showError(message);
    });

    this.#events.onAppErrorCleared(() => {
      this.#view.clear();
    });
  }
}
