import '../style.css';
import { UserController } from './controller/UserController';
import { ProductController } from './controller/ProductController';
import { ModelController } from './controller/ModelTrainingController';
import { TFVisorController } from './controller/TFVisorController';
import { WorkerController } from './controller/WorkerController';
import Events from './events/events';
import { UserService } from './service/UserService';
import { ProductService } from './service/ProductService';
import { UserView } from './view/UserView';
import { ProductView } from './view/ProductView';
import { ModelView } from './view/ModelTrainingView';
import { TFVisorView } from './view/TFVisorView';
import type { User } from './types';

const userService = new UserService();
const productService = new ProductService();

const userView = new UserView();
const productView = new ProductView();
const modelView = new ModelView();
const tfVisorView = new TFVisorView();
const mlWorker = new Worker(new URL('./workers/modelTrainingWorker.ts', import.meta.url), { type: 'module' });

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
