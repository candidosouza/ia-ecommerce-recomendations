import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';

import { env } from './config/env';
import { productRoutes } from './modules/products/product.routes';
import { userRoutes } from './modules/users/user.routes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN
    })
  );
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/products', productRoutes);
  app.use('/api/users', userRoutes);

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: 'Payload invalido.',
        issues: error.flatten()
      });
      return;
    }

    if (error instanceof Error) {
      response.status(400).json({
        message: error.message
      });
      return;
    }

    response.status(500).json({
      message: 'Erro interno do servidor.'
    });
  });

  return app;
}
