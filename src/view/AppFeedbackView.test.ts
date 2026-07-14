import { mountAppDom } from '../test/dom';

import { AppFeedbackView } from './AppFeedbackView';

describe('AppFeedbackView', () => {
  beforeEach(() => {
    mountAppDom();
  });

  it('exibe e limpa mensagem de erro global', () => {
    const view = new AppFeedbackView();

    view.showError('Falha ao carregar dados');
    expect(document.querySelector('#appFeedback')?.textContent).toContain('Falha ao carregar dados');

    view.clear();
    expect(document.querySelector('#appFeedback')?.textContent).toBe('');
  });
});
