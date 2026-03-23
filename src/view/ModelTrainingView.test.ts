import { makeProduct, makeUser } from '../test/factories';
import { mountAppDom } from '../test/dom';

import { ModelView } from './ModelTrainingView';

describe('ModelTrainingView', () => {
  beforeEach(() => {
    mountAppDom();
  });

  it('dispara callbacks de treino e recomendacao', () => {
    const view = new ModelView();
    const onTrain = vi.fn();
    const onRecommend = vi.fn();

    view.registerTrainModelCallback(onTrain);
    view.registerRunRecommendationCallback(onRecommend);
    view.enableRecommendButton();

    document.querySelector<HTMLButtonElement>('#trainModelBtn')?.click();
    document.querySelector<HTMLButtonElement>('#runRecommendationBtn')?.click();

    expect(onTrain).toHaveBeenCalled();
    expect(onRecommend).toHaveBeenCalled();
  });

  it('atualiza estado do botao de treino e habilita recomendacao', () => {
    const view = new ModelView();
    const trainButton = document.querySelector<HTMLButtonElement>('#trainModelBtn');
    const recommendationButton = document.querySelector<HTMLButtonElement>('#runRecommendationBtn');

    view.updateTrainingProgress({ progress: 10 });
    expect(trainButton?.disabled).toBe(true);

    view.updateTrainingProgress({ progress: 100 });
    expect(trainButton?.disabled).toBe(false);
    expect(trainButton?.textContent).toContain('Train Recommendation Model');

    view.enableRecommendButton();
    expect(recommendationButton?.disabled).toBe(false);
  });

  it('renderiza compras de todos usuarios e alterna visibilidade', () => {
    const view = new ModelView();
    const users = [
      makeUser({ purchases: [makeProduct()] }),
      makeUser({ id: 2, name: 'Joao', purchases: [] })
    ];

    view.renderAllUsersPurchases(users);
    expect(document.querySelector('#allUsersPurchasesList')?.textContent).toContain('Maria');

    const purchasesDiv = document.querySelector<HTMLElement>('#purchasesDiv');
    const purchasesList = document.querySelector<HTMLElement>('#allUsersPurchasesList');
    const arrow = document.querySelector<HTMLElement>('#purchasesArrow');

    purchasesDiv?.click();
    expect(purchasesList?.style.display).toBe('block');
    expect(arrow?.className).toContain('bi-chevron-up');

    purchasesDiv?.click();
    expect(purchasesList?.style.display).toBe('none');
    expect(arrow?.className).toContain('bi-chevron-down');
  });
});
