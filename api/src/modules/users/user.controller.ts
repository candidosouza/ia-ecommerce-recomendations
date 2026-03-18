import type { Request, Response } from 'express';

import { createUserSchema, updateUserSchema } from './user.schemas';
import { UserService } from './user.service';

export class UserController {
  constructor(private readonly service: UserService) {}

  findAll = async (_request: Request, response: Response) => {
    const users = await this.service.findAll();
    response.json(users);
  };

  findById = async (request: Request, response: Response) => {
    const userId = Number(request.params.id);
    const user = await this.service.findById(userId);

    if (!user) {
      response.status(404).json({ message: 'Usuario nao encontrado.' });
      return;
    }

    response.json(user);
  };

  create = async (request: Request, response: Response) => {
    const payload = createUserSchema.parse(request.body);
    const user = await this.service.create(payload);
    response.status(201).json(user);
  };

  update = async (request: Request, response: Response) => {
    const userId = Number(request.params.id);
    const payload = updateUserSchema.parse(request.body);
    const user = await this.service.update(userId, payload);

    if (!user) {
      response.status(404).json({ message: 'Usuario nao encontrado.' });
      return;
    }

    response.json(user);
  };
}
