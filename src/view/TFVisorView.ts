import * as tfvis from '@tensorflow/tfjs-vis';

import { View } from './View';

import type { TrainingLog } from '../types';

export class TFVisorView extends View {
  #logs: TrainingLog[] = [];
  #lossPoints: Array<{ x: number; y: number }> = [];
  #accPoints: Array<{ x: number; y: number }> = [];

  constructor() {
    super();
    tfvis.visor().open();
  }

  resetDashboard() {
    this.#logs = [];
    this.#lossPoints = [];
    this.#accPoints = [];
  }

  handleTrainingLog(log: TrainingLog) {
    const { epoch, loss, accuracy } = log;
    this.#lossPoints.push({ x: epoch, y: loss });
    this.#accPoints.push({ x: epoch, y: accuracy });
    this.#logs.push(log);

    tfvis.render.linechart(
      {
        name: 'Precisao do Modelo',
        tab: 'Treinamento'
      },
      { values: this.#accPoints, series: ['precisao'] },
      {
        xLabel: 'Epoca',
        yLabel: 'Precisao (%)',
        height: 300
      }
    );

    tfvis.render.linechart(
      {
        name: 'Erro de Treinamento',
        tab: 'Treinamento'
      },
      { values: this.#lossPoints, series: ['erros'] },
      {
        xLabel: 'Epoca',
        yLabel: 'Valor do Erro',
        height: 300
      }
    );
  }
}
