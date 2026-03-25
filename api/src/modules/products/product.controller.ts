import type { NextFunction, Request, Response } from 'express';

import { parseId } from '../../utils/parseId';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  findAll = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const products = await this.service.findAll();
      response.json(products);
    } catch (error) {
      next(error);
    }
  };

  findById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productId = parseId(request.params.id);
      const product = await this.service.findById(productId);

      if (!product) {
        response.status(404).json({ message: 'Produto nao encontrado.' });
        return;
      }

      response.json(product);
    } catch (error) {
      next(error);
    }
  };
}
