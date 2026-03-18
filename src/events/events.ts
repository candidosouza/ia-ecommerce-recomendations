import { events } from './constants';

import type {
  Product,
  RecommendationsReadyPayload,
  TrainModelPayload,
  TrainingLog,
  TrainingProgress,
  User
} from '../types';

type PurchaseAddedPayload = { user: User; product: Product };
type UsersUpdatedPayload = { users: User[] };

export default class Events {
  private static on<T>(eventName: string, callback: (data: T) => void) {
    document.addEventListener(eventName, (event: Event) => {
      callback((event as CustomEvent<T>).detail);
    });
  }

  private static dispatch<T>(eventName: string, data: T) {
    document.dispatchEvent(new CustomEvent<T>(eventName, { detail: data }));
  }

  static onTrainingComplete(callback: (data: unknown) => void) {
    this.on(events.trainingComplete, callback);
  }

  static dispatchTrainingComplete(data: unknown) {
    this.dispatch(events.trainingComplete, data);
  }

  static onRecommend(callback: (data: User) => void) {
    this.on(events.recommend, callback);
  }

  static dispatchRecommend(data: User) {
    this.dispatch(events.recommend, data);
  }

  static onRecommendationsReady(callback: (data: RecommendationsReadyPayload) => void) {
    this.on(events.recommendationsReady, callback);
  }

  static dispatchRecommendationsReady(data: RecommendationsReadyPayload) {
    this.dispatch(events.recommendationsReady, data);
  }

  static onTrainModel(callback: (data: TrainModelPayload) => void) {
    this.on(events.modelTrain, callback);
  }

  static dispatchTrainModel(data: TrainModelPayload) {
    this.dispatch(events.modelTrain, data);
  }

  static onTFVisLogs(callback: (data: TrainingLog) => void) {
    this.on(events.tfvisLogs, callback);
  }

  static dispatchTFVisLogs(data: TrainingLog) {
    this.dispatch(events.tfvisLogs, data);
  }

  static onTFVisorData(callback: (data: unknown) => void) {
    this.on(events.tfvisData, callback);
  }

  static dispatchTFVisorData(data: unknown) {
    this.dispatch(events.tfvisData, data);
  }

  static onProgressUpdate(callback: (data: TrainingProgress) => void) {
    this.on(events.modelProgressUpdate, callback);
  }

  static dispatchProgressUpdate(data: TrainingProgress) {
    this.dispatch(events.modelProgressUpdate, data);
  }

  static onUserSelected(callback: (data: User) => void) {
    this.on(events.userSelected, callback);
  }

  static dispatchUserSelected(data: User) {
    this.dispatch(events.userSelected, data);
  }

  static onUsersUpdated(callback: (data: UsersUpdatedPayload) => void) {
    this.on(events.usersUpdated, callback);
  }

  static dispatchUsersUpdated(data: UsersUpdatedPayload) {
    this.dispatch(events.usersUpdated, data);
  }

  static onPurchaseAdded(callback: (data: PurchaseAddedPayload) => void) {
    this.on(events.purchaseAdded, callback);
  }

  static dispatchPurchaseAdded(data: PurchaseAddedPayload) {
    this.dispatch(events.purchaseAdded, data);
  }

  static onPurchaseRemoved(callback: (data: unknown) => void) {
    this.on(events.purchaseRemoved, callback);
  }

  static dispatchEventPurchaseRemoved(data: unknown) {
    this.dispatch(events.purchaseRemoved, data);
  }
}
