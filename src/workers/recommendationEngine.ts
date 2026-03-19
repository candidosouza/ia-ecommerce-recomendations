import * as tf from '@tensorflow/tfjs';

import type {
  Product,
  ProductVector,
  RecommendedProduct,
  TrainingContext,
  User
} from '../types';

const WEIGHTS = {
  category: 0.4,
  color: 0.3,
  price: 0.2,
  age: 0.1
} as const;

type TrainingContextBase = Omit<TrainingContext, 'productVectors'>;
type TrainingData = {
  xs: tf.Tensor2D;
  ys: tf.Tensor2D;
  inputDimension: number;
};

type EpochLog = {
  loss?: number;
  accuracy?: number;
  acc?: number;
};

type TrainOptions = {
  epochs?: number;
  batchSize?: number;
  onEpochEnd?: (epoch: number, metrics: { loss: number; accuracy: number }) => void;
};

export const normalize = (value: number, min: number, max: number) =>
  (value - min) / ((max - min) || 1);

const normalizeLabel = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function makeContext(products: Product[], users: User[]): TrainingContext {
  const ages = users.map((user) => user.age);
  const prices = products.map((product) => product.price);

  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const colors = [...new Set(products.map((product) => normalizeLabel(product.color)))];
  const categories = [...new Set(products.map((product) => normalizeLabel(product.category)))];

  const colorsIndex = Object.fromEntries(colors.map((color, index) => [color, index]));
  const categoriesIndex = Object.fromEntries(categories.map((category, index) => [category, index]));

  const midAge = (minAge + maxAge) / 2;
  const ageSums: Record<string, number> = {};
  const ageCounts: Record<string, number> = {};

  users.forEach((user) => {
    user.purchases.forEach((purchase) => {
      ageSums[purchase.name] = (ageSums[purchase.name] || 0) + user.age;
      ageCounts[purchase.name] = (ageCounts[purchase.name] || 0) + 1;
    });
  });

  const productAvgAgeNorm = Object.fromEntries(
    products.map((product) => {
      const avg = ageCounts[product.name] ? ageSums[product.name] / ageCounts[product.name] : midAge;
      return [product.name, normalize(avg, minAge, maxAge)];
    })
  );

  const baseContext: TrainingContextBase = {
    ages,
    prices,
    products,
    users,
    colorsIndex,
    categoriesIndex,
    productAvgAgeNorm,
    minAge,
    maxAge,
    minPrice,
    maxPrice,
    numCategories: categories.length,
    numColors: colors.length,
    dimensions: 2 + categories.length + colors.length
  };

  const productVectors = products.map((product) => ({
    name: product.name,
    meta: { ...product },
    vector: Array.from(encodeProduct(product, baseContext).dataSync())
  })) satisfies ProductVector[];

  return {
    ...baseContext,
    productVectors
  };
}

function oneHotWeighted(index: number, length: number, weight: number) {
  if (length <= 1) {
    return tf.tensor1d([weight]);
  }

  return tf.oneHot(index, length).cast('float32').mul(weight) as tf.Tensor1D;
}

export function encodeProduct(product: Product, context: TrainingContextBase | TrainingContext) {
  const price = tf.tensor1d([
    normalize(product.price, context.minPrice, context.maxPrice) * WEIGHTS.price
  ]);

  const age = tf.tensor1d([(context.productAvgAgeNorm[product.name] ?? 0.5) * WEIGHTS.age]);

  const category = oneHotWeighted(
    context.categoriesIndex[normalizeLabel(product.category)],
    context.numCategories,
    WEIGHTS.category
  );

  const color = oneHotWeighted(
    context.colorsIndex[normalizeLabel(product.color)],
    context.numColors,
    WEIGHTS.color
  );

  return tf.concat1d([price, age, category, color] as tf.Tensor1D[]);
}

export function encodeUser(user: User, context: TrainingContextBase | TrainingContext) {
  if (user.purchases.length) {
    return tf
      .stack(user.purchases.map((product) => encodeProduct(product, context)))
      .mean(0)
      .reshape([1, context.dimensions]);
  }

  return tf
    .concat1d([
      tf.zeros([1]),
      tf.tensor1d([normalize(user.age, context.minAge, context.maxAge) * WEIGHTS.age]),
      tf.zeros([context.numCategories]),
      tf.zeros([context.numColors])
    ])
    .reshape([1, context.dimensions]);
}

export function createTrainingData(context: TrainingContext): TrainingData {
  const inputs: number[][] = [];
  const labels: number[] = [];

  context.users
    .filter((user) => user.purchases.length > 0)
    .forEach((user) => {
      const userVector = Array.from(encodeUser(user, context).dataSync());

      context.products.forEach((product) => {
        const productVector = Array.from(encodeProduct(product, context).dataSync());
        const label = user.purchases.some((purchase) => purchase.name === product.name) ? 1 : 0;

        inputs.push([...userVector, ...productVector]);
        labels.push(label);
      });
    });

  return {
    xs: tf.tensor2d(inputs),
    ys: tf.tensor2d(labels, [labels.length, 1]),
    inputDimension: context.dimensions * 2
  };
}

export async function configureNeuralNetAndTrain(
  trainData: TrainingData,
  options: TrainOptions = {}
) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [trainData.inputDimension],
      units: 128,
      activation: 'relu'
    })
  );

  model.add(
    tf.layers.dense({
      units: 64,
      activation: 'relu'
    })
  );

  model.add(
    tf.layers.dense({
      units: 32,
      activation: 'relu'
    })
  );

  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  const resolveAccuracy = (logs?: EpochLog) => logs?.accuracy ?? logs?.acc ?? 0;
  const resolveLoss = (logs?: EpochLog) => logs?.loss ?? 0;

  await model.fit(trainData.xs, trainData.ys, {
    epochs: options.epochs ?? 100,
    batchSize: options.batchSize ?? 32,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        options.onEpochEnd?.(epoch + 1, {
          loss: resolveLoss(logs),
          accuracy: resolveAccuracy(logs)
        });
      }
    }
  });

  return model;
}

export function recommendProducts(
  user: User,
  context: TrainingContext,
  model: tf.LayersModel
): RecommendedProduct[] {
  const userVector = Array.from(encodeUser(user, context).dataSync());

  const inputs = context.productVectors.map(({ vector }) => [...userVector, ...vector]);
  const inputTensor = tf.tensor2d(inputs);
  const predictionTensor = model.predict(inputTensor) as tf.Tensor;
  const scores = Array.from(predictionTensor.dataSync());

  return context.productVectors
    .map((item, index) => ({
      ...item.meta,
      score: scores[index]
    }))
    .sort((a, b) => b.score - a.score);
}
