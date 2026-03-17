import type Events from '../events/events';
import type { UserService } from '../service/UserService';
import type { TrainingProgress, User } from '../types';
import type { ModelView } from '../view/ModelTrainingView';

export class ModelController {
  #modelView: ModelView;
  #userService: UserService;
  #events: typeof Events;
  #currentUser: User | null = null;
  #alreadyTrained = false;

  constructor({
    modelView,
    userService,
    events
  }: {
    modelView: ModelView;
    userService: UserService;
    events: typeof Events;
  }) {
    this.#modelView = modelView;
    this.#userService = userService;
    this.#events = events;
    this.init();
  }

  static init(deps: { modelView: ModelView; userService: UserService; events: typeof Events }) {
    return new ModelController(deps);
  }

  private init() {
    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.#modelView.registerTrainModelCallback(this.handleTrainModel.bind(this));
    this.#modelView.registerRunRecommendationCallback(this.handleRunRecommendation.bind(this));

    this.#events.onUserSelected((user) => {
      this.#currentUser = user;
      if (this.#alreadyTrained) {
        this.#modelView.enableRecommendButton();
      }
    });

    this.#events.onTrainingComplete(() => {
      this.#alreadyTrained = true;
      if (this.#currentUser) {
        this.#modelView.enableRecommendButton();
      }
    });

    this.#events.onUsersUpdated(async (data) => this.refreshUsersPurchaseData(data));
    this.#events.onProgressUpdate((progress) => this.handleTrainingProgressUpdate(progress));
  }

  private async handleTrainModel() {
    const users = await this.#userService.getUsers();
    this.#events.dispatchTrainModel(users);
  }

  private handleTrainingProgressUpdate(progress: TrainingProgress) {
    this.#modelView.updateTrainingProgress(progress);
  }

  private async handleRunRecommendation() {
    if (!this.#currentUser) return;

    const updatedUser = await this.#userService.getUserById(this.#currentUser.id);
    if (updatedUser) {
      this.#events.dispatchRecommend(updatedUser);
    }
  }

  private async refreshUsersPurchaseData({ users }: { users: User[] }) {
    this.#modelView.renderAllUsersPurchases(users);
  }
}
