import '../style.css';
import { ModelController } from './controller/ModelTrainingController';
import { ProductController } from './controller/ProductController';
import { TFVisorController } from './controller/TFVisorController';
import { UserController } from './controller/UserController';
import { WorkerController } from './controller/WorkerController';
import Events from './events/events';
import { ProductService } from './service/ProductService';
import { UserService } from './service/UserService';
import { ModelView } from './view/ModelTrainingView';
import { ProductView } from './view/ProductView';
import { TFVisorView } from './view/TFVisorView';
import { UserView } from './view/UserView';

import type { User } from './types';

const userService = new UserService();
const productService = new ProductService();

const userView = new UserView();
const productView = new ProductView();
const modelView = new ModelView();
const tfVisorView = new TFVisorView();
const mlWorker = new Worker(new URL('./workers/modelTrainingWorker.ts', import.meta.url), {
  type: 'module'
});

async function bootstrap() {
  const workerController = WorkerController.init({
    worker: mlWorker,
    events: Events
  });

  const users = await userService.getDefaultUsers();
  workerController.triggerTrain(users);

  ModelController.init({
    modelView,
    userService,
    events: Events
  });

  TFVisorController.init({
    tfVisorView,
    events: Events
  });

  ProductController.init({
    productView,
    productService,
    events: Events
  });

  const userController = UserController.init({
    userView,
    userService,
    events: Events
  });

  const demoUser: User = {
    id: 99,
    name: 'Josezin da Silva',
    age: 30,
    purchases: []
  };

  await userController.renderUsers(demoUser);
}

void bootstrap();
