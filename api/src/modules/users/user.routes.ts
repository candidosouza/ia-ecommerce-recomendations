import { Router } from 'express';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const router = Router();
const controller = new UserController(new UserService(new UserRepository()));

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.put('/:id', controller.update);

export const userRoutes = router;
