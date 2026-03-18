import type { Request, Response } from 'express';

import { ProductService } from './product.service';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  findAll = async (_request: Request, response: Response) => {
    const products = await this.service.findAll();
    response.json(products);
  };

  findById = async (request: Request, response: Response) => {
    const productId = Number(request.params.id);
    const product = await this.service.findById(productId);

    if (!product) {
      response.status(404).json({ message: 'Produto nao encontrado.' });
      return;
    }

    response.json(product);
  };
}
