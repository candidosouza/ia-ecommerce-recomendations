import { makeUser } from '../test/factories';

import type { Product } from '../types';

import { ModelController } from './ModelTrainingController';

describe('ModelTrainingController', () => {
  it('dispara treino com usuarios atuais', async () => {
    const users = [makeUser()];
    const products: Product[] = [];
    const modelView = {
      registerTrainModelCallback: vi.fn(),
      registerRunRecommendationCallback: vi.fn(),
      enableRecommendButton: vi.fn(),
      updateTrainingProgress: vi.fn(),
      renderAllUsersPurchases: vi.fn()
    };
    const productService = {
      getProducts: vi.fn().mockResolvedValue(products)
    };
    const userService = {
      getUsers: vi.fn().mockResolvedValue(users),
      getUserById: vi.fn()
    };
    const events = {
      onUserSelected: vi.fn(),
      onTrainingComplete: vi.fn(),
      onUsersUpdated: vi.fn(),
      onProgressUpdate: vi.fn(),
      dispatchTrainModel: vi.fn(),
      dispatchRecommend: vi.fn()
    };

    ModelController.init({
      modelView: modelView as never,
      productService: productService as never,
      userService: userService as never,
      events: events as never
    });

    const onTrain = modelView.registerTrainModelCallback.mock.calls[0][0];
    await onTrain();

    expect(events.dispatchTrainModel).toHaveBeenCalledWith({ users, products });
  });

  it('habilita recomendacao e atualiza progresso e lista consolidada', async () => {
    const currentUser = makeUser();
    const modelView = {
      registerTrainModelCallback: vi.fn(),
      registerRunRecommendationCallback: vi.fn(),
      enableRecommendButton: vi.fn(),
      updateTrainingProgress: vi.fn(),
      renderAllUsersPurchases: vi.fn()
    };
    const productService = {
      getProducts: vi.fn()
    };
    const userService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(currentUser)
    };
    const events = {
      onUserSelected: vi.fn(),
      onTrainingComplete: vi.fn(),
      onUsersUpdated: vi.fn(),
      onProgressUpdate: vi.fn(),
      dispatchTrainModel: vi.fn(),
      dispatchRecommend: vi.fn()
    };

    ModelController.init({
      modelView: modelView as never,
      productService: productService as never,
      userService: userService as never,
      events: events as never
    });

    const handleUserSelected = events.onUserSelected.mock.calls[0][0];
    const handleTrainingComplete = events.onTrainingComplete.mock.calls[0][0];
    const handleUsersUpdated = events.onUsersUpdated.mock.calls[0][0];
    const handleProgress = events.onProgressUpdate.mock.calls[0][0];

    handleUserSelected(currentUser);
    expect(modelView.enableRecommendButton).not.toHaveBeenCalled();

    handleTrainingComplete();
    expect(modelView.enableRecommendButton).toHaveBeenCalled();

    handleUsersUpdated({ users: [currentUser] });
    expect(modelView.renderAllUsersPurchases).toHaveBeenCalledWith([currentUser]);

    handleProgress({ progress: 60 });
    expect(modelView.updateTrainingProgress).toHaveBeenCalledWith({ progress: 60 });
  });

  it('dispara recomendacao para usuario selecionado', async () => {
    const currentUser = makeUser();
    const modelView = {
      registerTrainModelCallback: vi.fn(),
      registerRunRecommendationCallback: vi.fn(),
      enableRecommendButton: vi.fn(),
      updateTrainingProgress: vi.fn(),
      renderAllUsersPurchases: vi.fn()
    };
    const productService = {
      getProducts: vi.fn()
    };
    const userService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(currentUser)
    };
    const events = {
      onUserSelected: vi.fn(),
      onTrainingComplete: vi.fn(),
      onUsersUpdated: vi.fn(),
      onProgressUpdate: vi.fn(),
      dispatchTrainModel: vi.fn(),
      dispatchRecommend: vi.fn()
    };

    ModelController.init({
      modelView: modelView as never,
      productService: productService as never,
      userService: userService as never,
      events: events as never
    });

    const handleUserSelected = events.onUserSelected.mock.calls[0][0];
    handleUserSelected(currentUser);

    const onRecommend = modelView.registerRunRecommendationCallback.mock.calls[0][0];
    await onRecommend();

    expect(events.dispatchRecommend).toHaveBeenCalledWith(currentUser);
  });
});
