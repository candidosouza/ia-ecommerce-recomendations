import Events from '../events/events';
import { mountAppDom } from '../test/dom';
import { AppFeedbackView } from '../view/AppFeedbackView';

import { AppFeedbackController } from './AppFeedbackController';

describe('AppFeedbackController', () => {
  beforeEach(() => {
    mountAppDom();
  });

  it('sincroniza eventos globais de erro com a view', () => {
    const view = new AppFeedbackView();
    AppFeedbackController.init({ events: Events, view });

    Events.dispatchAppError({ message: 'Erro de API' });
    expect(document.querySelector('#appFeedback')?.textContent).toContain('Erro de API');

    Events.dispatchAppErrorCleared();
    expect(document.querySelector('#appFeedback')?.textContent).toBe('');
  });
});
