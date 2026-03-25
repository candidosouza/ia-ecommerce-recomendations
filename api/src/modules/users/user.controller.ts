import type { NextFunction, Request, Response } from 'express';

import { parseId } from '../../utils/parseId';
import { createUserSchema, updateUserSchema } from './user.schemas';
import { UserService } from './user.service';

export class UserController {
  constructor(private readonly service: UserService) {}

  findAll = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await this.service.findAll();
      response.json(users);
    } catch (error) {
      next(error);
    }
  };

  findById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = parseId(request.params.id);
      const user = await this.service.findById(userId);

      if (!user) {
        response.status(404).json({ message: 'Usuario nao encontrado.' });
        return;
      }

      response.json(user);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const payload = createUserSchema.parse(request.body);
      const user = await this.service.create(payload);
      response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = parseId(request.params.id);
      const payload = updateUserSchema.parse(request.body);
      const user = await this.service.update(userId, payload);

      if (!user) {
        response.status(404).json({ message: 'Usuario nao encontrado.' });
        return;
      }

      response.json(user);
    } catch (error) {
      next(error);
    }
  };
}
