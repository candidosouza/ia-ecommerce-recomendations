import { getErrorMessage } from '../utils/errors';
import type Events from '../events/events';
import type { UserService } from '../service/UserService';
import type { Product, User } from '../types';
import type { UserView } from '../view/UserView';

export class UserController {
  #userService: UserService;
  #userView: UserView;
  #events: typeof Events;

  constructor({
    userView,
    userService,
    events
  }: {
    userView: UserView;
    userService: UserService;
    events: typeof Events;
  }) {
    this.#userView = userView;
    this.#userService = userService;
    this.#events = events;
  }

  static init(deps: { userView: UserView; userService: UserService; events: typeof Events }) {
    return new UserController(deps);
  }

  async renderUsers(nonTrainedUser: User) {
    const users = await this.#userService.getUsers();
    const existingDemoUser = users.find(
      (user) => user.name === nonTrainedUser.name && user.age === nonTrainedUser.age
    );
    const demoUser = existingDemoUser ?? (await this.#userService.addUser(nonTrainedUser));
    const defaultAndNonTrained = [
      demoUser,
      ...users.filter((user) => user.id !== demoUser.id)
    ];

    this.#userView.renderUserOptions(defaultAndNonTrained);
    this.setupCallbacks();
    this.setupPurchaseObserver();
    this.#events.dispatchUsersUpdated({ users: defaultAndNonTrained });
  }

  private setupCallbacks() {
    this.#userView.registerUserSelectCallback(this.handleUserSelect.bind(this));
    this.#userView.registerPurchaseRemoveCallback(this.handlePurchaseRemove.bind(this));
  }

  private setupPurchaseObserver() {
    this.#events.onPurchaseAdded(async (data) => this.handlePurchaseAdded(data));
  }

  private async handleUserSelect(userId: number) {
    try {
      const user = await this.#userService.getUserById(userId);
      if (!user) return;

      this.#events.dispatchUserSelected(user);
      this.displayUserDetails(user);
      this.#events.dispatchAppErrorCleared();
    } catch (error) {
      this.#events.dispatchAppError({
        message: getErrorMessage(error, 'Nao foi possivel carregar o usuario selecionado.')
      });
    }
  }

  private async handlePurchaseAdded({ user, product }: { user: User; product: Product }) {
    try {
      const updatedUser = await this.#userService.getUserById(user.id);
      if (!updatedUser) return;

      updatedUser.purchases.push({ ...product });
      const persistedUser = await this.#userService.updateUser(updatedUser);
      const users = await this.#userService.getUsers();

      this.displayUserDetails(persistedUser);
      this.#events.dispatchUserSelected(persistedUser);
      this.#events.dispatchUsersUpdated({ users });
      this.#events.dispatchAppErrorCleared();
    } catch (error) {
      this.#events.dispatchAppError({
        message: getErrorMessage(error, 'Nao foi possivel registrar a compra.')
      });
    }
  }

  private async handlePurchaseRemove({
    userId,
    product
  }: {
    userId: number | null;
    product: Product;
  }) {
    if (!userId) return;

    try {
      const user = await this.#userService.getUserById(userId);
      if (!user) return;

      const index = user.purchases.findIndex((item) => item.id === product.id);
      if (index === -1) return;

      user.purchases.splice(index, 1);
      const persistedUser = await this.#userService.updateUser(user);
      const updatedUsers = await this.#userService.getUsers();

      this.displayUserDetails(persistedUser);
      this.#events.dispatchUserSelected(persistedUser);
      this.#events.dispatchUsersUpdated({ users: updatedUsers });
      this.#events.dispatchAppErrorCleared();
    } catch (error) {
      this.#events.dispatchAppError({
        message: getErrorMessage(error, 'Nao foi possivel remover a compra.')
      });
    }
  }

  private displayUserDetails(user: User) {
    this.#userView.renderUserDetails(user);
    this.#userView.renderPastPurchases(user.purchases);
  }

  getSelectedUserId() {
    return this.#userView.getSelectedUserId();
  }
}
