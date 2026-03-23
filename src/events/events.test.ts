import Events from './events';
import { makeProduct, makeUser } from '../test/factories';

describe('Events', () => {
  it('dispatcha e escuta user:selected', () => {
    const callback = vi.fn();
    const user = makeUser();

    Events.onUserSelected(callback);
    Events.dispatchUserSelected(user);

    expect(callback).toHaveBeenCalledWith(user);
  });

  it('dispatcha e escuta purchase:added', () => {
    const callback = vi.fn();
    const payload = { user: makeUser(), product: makeProduct() };

    Events.onPurchaseAdded(callback);
    Events.dispatchPurchaseAdded(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('dispatcha e escuta recommendations:ready', () => {
    const callback = vi.fn();
    const payload = { recommendations: [{ ...makeProduct(), score: 0.95 }] };

    Events.onRecommendationsReady(callback);
    Events.dispatchRecommendationsReady(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });
});
