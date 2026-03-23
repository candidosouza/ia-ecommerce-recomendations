import { UserController } from './UserController';
import { makeProduct, makeUser } from '../test/factories';

describe('UserController', () => {
  it('renderiza usuarios e publica users:updated', async () => {
    const defaultUsers = [makeUser({ id: 10 }), makeUser({ id: 11 })];
    const nonTrainedUser = makeUser({ id: 99, name: 'Nao Treinado' });
    const createdDemoUser = makeUser({ id: 999, name: 'Nao Treinado' });

    const userService = {
      getDefaultUsers: vi.fn(),
      addUser: vi.fn().mockResolvedValue(createdDemoUser),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      getUsers: vi.fn().mockResolvedValue(defaultUsers)
    };

    const userView = {
      renderUserOptions: vi.fn(),
      registerUserSelectCallback: vi.fn(),
      registerPurchaseRemoveCallback: vi.fn(),
      renderUserDetails: vi.fn(),
      renderPastPurchases: vi.fn(),
      addPastPurchase: vi.fn(),
      getSelectedUserId: vi.fn()
    };

    const events = {
      dispatchUsersUpdated: vi.fn(),
      onPurchaseAdded: vi.fn(),
      dispatchUserSelected: vi.fn()
    };

    const controller = UserController.init({
      userView: userView as never,
      userService: userService as never,
      events: events as never
    });

    await controller.renderUsers(nonTrainedUser);

    expect(userView.renderUserOptions).toHaveBeenCalledWith([createdDemoUser, ...defaultUsers]);
    expect(events.dispatchUsersUpdated).toHaveBeenCalledWith({
      users: [createdDemoUser, ...defaultUsers]
    });
  });

  it('adiciona compra quando evento purchase:added e recebido', async () => {
    const product = makeProduct();
    const user = makeUser({ purchases: [] });

    const userService = {
      getDefaultUsers: vi.fn(),
      addUser: vi.fn().mockResolvedValue(makeUser({ id: 99 })),
      getUserById: vi.fn().mockResolvedValue(user),
      updateUser: vi.fn().mockResolvedValue({ ...user, purchases: [product] }),
      getUsers: vi.fn().mockResolvedValue([{ ...user, purchases: [product] }])
    };

    const userView = {
      renderUserOptions: vi.fn(),
      registerUserSelectCallback: vi.fn(),
      registerPurchaseRemoveCallback: vi.fn(),
      renderUserDetails: vi.fn(),
      renderPastPurchases: vi.fn(),
      addPastPurchase: vi.fn(),
      getSelectedUserId: vi.fn()
    };

    const events = {
      dispatchUsersUpdated: vi.fn(),
      onPurchaseAdded: vi.fn(),
      dispatchUserSelected: vi.fn()
    };

    const controller = UserController.init({
      userView: userView as never,
      userService: userService as never,
      events: events as never
    });

    await controller.renderUsers(makeUser({ id: 99 }));

    const purchaseAddedHandler = events.onPurchaseAdded.mock.calls[0][0];
    await purchaseAddedHandler({ user, product });

    expect(userService.updateUser).toHaveBeenCalled();
    expect(userView.addPastPurchase).toHaveBeenCalledWith(product);
    expect(events.dispatchUsersUpdated).toHaveBeenCalled();
  });
});
