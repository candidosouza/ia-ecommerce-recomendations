/// <reference lib="webworker" />
import { workerEvents } from '../events/constants';

import type { Product, TrainingContext, User } from '../types';

import {
  configureNeuralNetAndTrain,
  createTrainingData,
  makeContext,
  recommendProducts
} from './recommendationEngine';

type TrainMessage = { action: typeof workerEvents.trainModel; users: User[]; products: Product[] };
type RecommendMessage = { action: typeof workerEvents.recommend; user: User };
type WorkerInputMessage = TrainMessage | RecommendMessage;

const send = <T>(message: T) => {
  self.postMessage(message);
};

let globalContext: TrainingContext | null = null;
let model: Awaited<ReturnType<typeof configureNeuralNetAndTrain>> | null = null;
const TRAINING_EPOCHS = 100;

async function trainModel({ users, products }: { users: User[]; products: Product[] }) {
  console.log('Training model with users:', users);

  send({ type: workerEvents.progressUpdate, progress: { progress: 1 } });

  const context = makeContext(products, users);
  globalContext = context;

  const trainingData = createTrainingData(context);
  model = await configureNeuralNetAndTrain(trainingData, {
    epochs: TRAINING_EPOCHS,
    onEpochEnd: (epoch, metrics) => {
      send({
        type: workerEvents.trainingLog,
        epoch,
        loss: metrics.loss,
        accuracy: metrics.accuracy
      });

      send({
        type: workerEvents.progressUpdate,
        progress: { progress: Math.round((epoch / TRAINING_EPOCHS) * 100) }
      });
    }
  });

  send({ type: workerEvents.trainingComplete });
}

function recommend(user: User) {
  if (!model || !globalContext) return;

  const recommendations = recommendProducts(user, globalContext, model);

  send({
    type: workerEvents.recommend,
    user,
    recommendations
  });
}

const handlers = {
  [workerEvents.trainModel]: trainModel,
  [workerEvents.recommend]: ({ user }: { user: User }) => recommend(user)
};

self.onmessage = (event: MessageEvent<WorkerInputMessage>) => {
  const { action, ...data } = event.data;
  const handler = handlers[action];

  if (handler) {
    void handler(data as never);
  }
};
