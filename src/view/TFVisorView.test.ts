const { openSpy, linechartSpy } = vi.hoisted(() => ({
  openSpy: vi.fn(),
  linechartSpy: vi.fn()
}));

vi.mock('@tensorflow/tfjs-vis', () => {
  return {
    visor: () => ({
      open: openSpy
    }),
    render: {
      linechart: linechartSpy
    }
  };
});

import * as tfvis from '@tensorflow/tfjs-vis';

import { TFVisorView } from './TFVisorView';

describe('TFVisorView', () => {
  it('abre o visor na inicializacao e desenha graficos ao receber log', () => {
    const view = new TFVisorView();
    view.resetDashboard();
    view.handleTrainingLog({ epoch: 1, loss: 0.3, accuracy: 0.9 });

    expect(openSpy).toHaveBeenCalled();
    expect(linechartSpy).toHaveBeenCalledTimes(2);
  });
});
