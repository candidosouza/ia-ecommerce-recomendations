import defaultUsersData from '../../data/users.json';
import type { User } from '../types';

export class UserService {
  #storageKey = 'ew-academy-users';

  async getDefaultUsers() {
    const users = structuredClone(defaultUsersData) as User[];
    this.#setStorage(users);
    return users;
  }

  async getUsers() {
    return this.#getStorage();
  }

  async getUserById(userId: number) {
    return this.#getStorage().find((user) => user.id === userId);
  }

  async updateUser(user: User) {
    const users = this.#getStorage();
    const userIndex = users.findIndex((item) => item.id === user.id);
    users[userIndex] = { ...users[userIndex], ...user };
    this.#setStorage(users);
    return users[userIndex];
  }

  async addUser(user: User) {
    const users = this.#getStorage();
    this.#setStorage([user, ...users]);
  }

  #getStorage() {
    const data = sessionStorage.getItem(this.#storageKey);
    return data ? (JSON.parse(data) as User[]) : [];
  }

  #setStorage(data: User[]) {
    sessionStorage.setItem(this.#storageKey, JSON.stringify(data));
  }
}
