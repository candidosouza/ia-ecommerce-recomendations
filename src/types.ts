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

export interface TrainModelPayload {
  users: User[];
  products: Product[];
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
  recommendations: RecommendedProduct[];
  user?: User;
}

export interface RecommendedProduct extends Product {
  score: number;
}

export interface ProductVector {
  name: string;
  meta: Product;
  vector: number[];
}

export interface TrainingContext {
  ages: number[];
  prices: number[];
  products: Product[];
  users: User[];
  colorsIndex: Record<string, number>;
  categoriesIndex: Record<string, number>;
  productAvgAgeNorm: Record<string, number>;
  minAge: number;
  maxAge: number;
  minPrice: number;
  maxPrice: number;
  numCategories: number;
  numColors: number;
  dimensions: number;
  productVectors: ProductVector[];
}
