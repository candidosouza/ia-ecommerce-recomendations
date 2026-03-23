import * as tf from '@tensorflow/tfjs';

import { makeProduct, makeUser } from '../test/factories';

import {
  configureNeuralNetAndTrain,
  createTrainingData,
  encodeProduct,
  encodeUser,
  makeContext,
  normalize,
  recommendProducts
} from './recommendationEngine';

describe('recommendationEngine', () => {
  beforeAll(async () => {
    await tf.setBackend('cpu');
    await tf.ready();
  });

  it('normaliza valores no intervalo esperado', () => {
    expect(normalize(50, 0, 100)).toBe(0.5);
    expect(normalize(10, 10, 10)).toBe(0);
  });

  it('monta contexto com indices e vetores de produtos', () => {
    const products = [makeProduct(), makeProduct({ id: 2, color: 'Azul', category: 'Audio' })];
    const users = [makeUser(), makeUser({ id: 2, age: 40, purchases: [products[0]] })];

    const context = makeContext(products, users);

    expect(context.minAge).toBe(29);
    expect(context.maxAge).toBe(40);
    expect(context.numColors).toBe(2);
    expect(context.numCategories).toBe(2);
    expect(context.productVectors).toHaveLength(2);
  });

  it('codifica produto e usuario com o tamanho esperado', () => {
    const products = [makeProduct(), makeProduct({ id: 2, color: 'Azul', category: 'Audio' })];
    const users = [makeUser({ purchases: [products[0]] })];
    const context = makeContext(products, users);

    const productVector = encodeProduct(products[0], context);
    const userVector = encodeUser(users[0], context);

    expect(productVector.shape).toEqual([context.dimensions]);
    expect(userVector.shape).toEqual([1, context.dimensions]);
  });

  it('gera dados de treino combinando usuarios e produtos', () => {
    const products = [makeProduct(), makeProduct({ id: 2, name: 'Teclado', color: 'Azul' })];
    const users = [
      makeUser({ purchases: [products[0]] }),
      makeUser({ id: 2, purchases: [products[1]] })
    ];
    const context = makeContext(products, users);

    const trainData = createTrainingData(context);

    expect(trainData.inputDimension).toBe(context.dimensions * 2);
    expect(trainData.xs.shape[0]).toBe(4);
    expect(trainData.ys.shape).toEqual([4, 1]);
  });

  it('treina uma rede neural com configuracao minima', async () => {
    const products = [makeProduct(), makeProduct({ id: 2, name: 'Teclado', color: 'Azul' })];
    const users = [
      makeUser({ purchases: [products[0]] }),
      makeUser({ id: 2, purchases: [products[1]] })
    ];
    const context = makeContext(products, users);
    const trainData = createTrainingData(context);

    const onEpochEnd = vi.fn();
    const model = await configureNeuralNetAndTrain(trainData, {
      epochs: 1,
      batchSize: 1,
      onEpochEnd
    });

    expect(model).toBeDefined();
    expect(model.layers.length).toBeGreaterThan(0);
    expect(onEpochEnd).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        loss: expect.any(Number),
        accuracy: expect.any(Number)
      })
    );
  });

  it('ordena recomendacoes por score decrescente', () => {
    const products = [makeProduct(), makeProduct({ id: 2, name: 'Teclado', color: 'Azul' })];
    const user = makeUser({ purchases: [] });
    const context = makeContext(products, [user]);

    const model = {
      predict: vi.fn(() => tf.tensor2d([[0.2], [0.8]]))
    } as unknown as tf.LayersModel;

    const recommendations = recommendProducts(user, context, model);

    expect(recommendations).toHaveLength(2);
    expect(recommendations[0].score).toBeGreaterThan(recommendations[1].score);
    expect(recommendations[0].id).toBe(2);
  });
});
