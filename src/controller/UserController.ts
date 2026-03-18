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
    const existingDemoUser = users.find((user) => user.name === nonTrainedUser.name);
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
    const user = await this.#userService.getUserById(userId);
    if (!user) return;

    this.#events.dispatchUserSelected(user);
    this.displayUserDetails(user);
  }

  private async handlePurchaseAdded({ user, product }: { user: User; product: Product }) {
    const updatedUser = await this.#userService.getUserById(user.id);
    if (!updatedUser) return;

    updatedUser.purchases.push({ ...product });
    await this.#userService.updateUser(updatedUser);

    const lastPurchase = updatedUser.purchases[updatedUser.purchases.length - 1];
    this.#userView.addPastPurchase(lastPurchase);
    this.#events.dispatchUsersUpdated({ users: await this.#userService.getUsers() });
  }

  private async handlePurchaseRemove({
    userId,
    product
  }: {
    userId: number | null;
    product: Product;
  }) {
    if (!userId) return;

    const user = await this.#userService.getUserById(userId);
    if (!user) return;

    const index = user.purchases.findIndex((item) => item.id === product.id);
    if (index === -1) return;

    user.purchases.splice(index, 1);
    await this.#userService.updateUser(user);

    const updatedUsers = await this.#userService.getUsers();
    this.#events.dispatchUsersUpdated({ users: updatedUsers });
  }

  private displayUserDetails(user: User) {
    this.#userView.renderUserDetails(user);
    this.#userView.renderPastPurchases(user.purchases);
  }

  getSelectedUserId() {
    return this.#userView.getSelectedUserId();
  }
}
