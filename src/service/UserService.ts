import { apiClient } from './apiClient';

import type { User } from '../types';

export class UserService {
  async getDefaultUsers() {
    return this.getUsers();
  }

  async getUsers() {
    return apiClient<User[]>('/users');
  }

  async getUserById(userId: number) {
    return apiClient<User>(`/users/${userId}`);
  }

  async updateUser(user: User) {
    return apiClient<User>(`/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: user.name,
        age: user.age,
        purchases: user.purchases.map((product) => ({
          id: product.id
        }))
      })
    });
  }

  async addUser(user: User) {
    return apiClient<User>('/users', {
      method: 'POST',
      body: JSON.stringify({
        name: user.name,
        age: user.age,
        purchases: user.purchases.map((product) => ({
          id: product.id
        }))
      })
    });
  }
}
