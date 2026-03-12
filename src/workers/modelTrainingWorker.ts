/// <reference lib="webworker" />

import '@tensorflow/tfjs';
import { workerEvents } from '../events/constants';
import type { User } from '../types';

type TrainMessage = { action: typeof workerEvents.trainModel; users: User[] };
type RecommendMessage = { action: typeof workerEvents.recommend; user: User };
type WorkerInputMessage = TrainMessage | RecommendMessage;

const send = <T>(message: T) => {
  self.postMessage(message);
};

async function trainModel({ users }: { users: User[] }) {
  console.log('Training model with users:', users);

  send({ type: workerEvents.progressUpdate, progress: { progress: 50 } });

  send({
    type: workerEvents.trainingLog,
    epoch: 1,
    loss: 1,
    accuracy: 1
  });

  setTimeout(() => {
    send({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
    send({ type: workerEvents.trainingComplete });
  }, 1000);
}

function recommend(user: User) {
  console.log('will recommend for user:', user);
  send({
    type: workerEvents.recommend,
    user,
    recommendations: []
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
