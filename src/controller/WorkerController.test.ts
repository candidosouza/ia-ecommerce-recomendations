import { WorkerController } from './WorkerController';
import { workerEvents } from '../events/constants';
import { makeProduct, makeUser } from '../test/factories';

function createEventsMock() {
  return {
    onTrainModel: vi.fn(),
    onTrainingComplete: vi.fn(),
    onRecommend: vi.fn(),
    dispatchProgressUpdate: vi.fn(),
    dispatchTrainingComplete: vi.fn(),
    dispatchTFVisorData: vi.fn(),
    dispatchTFVisLogs: vi.fn(),
    dispatchRecommendationsReady: vi.fn()
  };
}

function createWorkerMock() {
  return {
    onmessage: null as ((event: MessageEvent) => void) | null,
    postMessage: vi.fn()
  } as unknown as Worker;
}

describe('WorkerController', () => {
  it('registra callbacks nos eventos de treino e recomendacao', () => {
    const worker = createWorkerMock();
    const events = createEventsMock();

    WorkerController.init({ worker, events: events as never });

    expect(events.onTrainModel).toHaveBeenCalledTimes(1);
    expect(events.onTrainingComplete).toHaveBeenCalledTimes(1);
    expect(events.onRecommend).toHaveBeenCalledTimes(1);
  });

  it('encaminha requisicao de treino para o worker', () => {
    const worker = createWorkerMock();
    const events = createEventsMock();

    WorkerController.init({ worker, events: events as never });

    const onTrainCallback = events.onTrainModel.mock.calls[0][0];
    const users = [makeUser()];

    onTrainCallback(users);

    expect(worker.postMessage).toHaveBeenCalledWith({
      action: workerEvents.trainModel,
      users
    });
  });

  it('propaga progresso e fim de treino recebidos do worker', () => {
    const worker = createWorkerMock();
    const events = createEventsMock();

    WorkerController.init({ worker, events: events as never });

    worker.onmessage?.({
      data: {
        type: workerEvents.progressUpdate,
        progress: { progress: 50 }
      }
    } as MessageEvent);

    worker.onmessage?.({
      data: {
        type: workerEvents.trainingComplete
      }
    } as MessageEvent);

    expect(events.dispatchProgressUpdate).toHaveBeenCalledWith({ progress: 50 });
    expect(events.dispatchTrainingComplete).toHaveBeenCalled();
  });

  it('propaga recomendacoes recebidas do worker', () => {
    const worker = createWorkerMock();
    const events = createEventsMock();

    WorkerController.init({ worker, events: events as never });

    worker.onmessage?.({
      data: {
        type: workerEvents.recommend,
        user: makeUser(),
        recommendations: [makeProduct()]
      }
    } as MessageEvent);

    expect(events.dispatchRecommendationsReady).toHaveBeenCalledWith({
      type: workerEvents.recommend,
      user: expect.any(Object),
      recommendations: expect.any(Array)
    });
  });
});
