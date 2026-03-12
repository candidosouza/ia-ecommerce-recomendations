import type { Product, User } from '../types';

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Mouse Gamer',
    category: 'Perifericos',
    price: 199.9,
    color: 'Preto',
    ...overrides
  };
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Maria',
    age: 29,
    purchases: [],
    ...overrides
  };
}
