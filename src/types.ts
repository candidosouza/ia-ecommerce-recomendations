export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  purchases: Product[];
}

export interface TrainingProgress {
  progress: number;
}

export interface TrainingLog {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface RecommendationsReadyPayload {
  recommendations: Product[];
  user?: User;
}
