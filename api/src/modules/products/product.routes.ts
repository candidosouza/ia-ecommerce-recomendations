import { Router } from 'express';

import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

const router = Router();
const controller = new ProductController(new ProductService(new ProductRepository()));

router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export const productRoutes = router;
