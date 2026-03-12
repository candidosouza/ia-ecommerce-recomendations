import type Events from '../events/events';
import type { TFVisorView } from '../view/TFVisorView';

export class TFVisorController {
  #tfVisorView: TFVisorView;
  #events: typeof Events;

  constructor({ tfVisorView, events }: { tfVisorView: TFVisorView; events: typeof Events }) {
    this.#tfVisorView = tfVisorView;
    this.#events = events;
    this.init();
  }

  static init(deps: { tfVisorView: TFVisorView; events: typeof Events }) {
    return new TFVisorController(deps);
  }

  private init() {
    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.#events.onTrainModel(() => {
      this.#tfVisorView.resetDashboard();
    });

    this.#events.onTFVisLogs((log) => {
      this.#tfVisorView.handleTrainingLog(log);
    });
  }
}
