import { workerEvents } from '../events/constants';
import type Events from '../events/events';
import type { TrainingLog, TrainingProgress, User } from '../types';

type WorkerMessage =
  | { type: typeof workerEvents.progressUpdate; progress: TrainingProgress }
  | { type: typeof workerEvents.trainingLog; epoch: number; loss: number; accuracy: number }
  | { type: typeof workerEvents.trainingComplete }
  | { type: typeof workerEvents.recommend; user: User; recommendations: [] }
  | { type: typeof workerEvents.tfVisData; data: unknown }
  | { type: typeof workerEvents.tfVisLogs; data: unknown };

export class WorkerController {
  #worker: Worker;
  #events: typeof Events;
  #alreadyTrained = false;

  constructor({ worker, events }: { worker: Worker; events: typeof Events }) {
    this.#worker = worker;
    this.#events = events;
    this.init();
  }

  static init(deps: { worker: Worker; events: typeof Events }) {
    return new WorkerController(deps);
  }

  private init() {
    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.#events.onTrainModel((data) => {
      this.#alreadyTrained = false;
      this.triggerTrain(data);
    });

    this.#events.onTrainingComplete(() => {
      this.#alreadyTrained = true;
    });

    this.#events.onRecommend((data) => {
      if (!this.#alreadyTrained) return;
      this.triggerRecommend(data);
    });

    const eventsToIgnoreLogs = new Set<string>([
      workerEvents.progressUpdate,
      workerEvents.trainingLog,
      workerEvents.tfVisData,
      workerEvents.tfVisLogs,
      workerEvents.trainingComplete
    ]);

    this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (!eventsToIgnoreLogs.has(event.data.type)) {
        console.log(event.data);
      }

      if (event.data.type === workerEvents.progressUpdate) {
        this.#events.dispatchProgressUpdate(event.data.progress);
      }

      if (event.data.type === workerEvents.trainingComplete) {
        this.#events.dispatchTrainingComplete(event.data);
      }

      if (event.data.type === workerEvents.tfVisData) {
        this.#events.dispatchTFVisorData(event.data.data);
      }

      if (event.data.type === workerEvents.trainingLog) {
        const { epoch, loss, accuracy } = event.data;
        this.#events.dispatchTFVisLogs({ epoch, loss, accuracy } satisfies TrainingLog);
      }

      if (event.data.type === workerEvents.recommend) {
        this.#events.dispatchRecommendationsReady(event.data);
      }
    };
  }

  triggerTrain(users: User[]) {
    this.#worker.postMessage({ action: workerEvents.trainModel, users });
  }

  triggerRecommend(user: User) {
    this.#worker.postMessage({ action: workerEvents.recommend, user });
  }
}
