import { TFVisorController } from './TFVisorController';

describe('TFVisorController', () => {
  it('reseta dashboard ao iniciar novo treino e encaminha logs', () => {
    const tfVisorView = {
      resetDashboard: vi.fn(),
      handleTrainingLog: vi.fn()
    };
    const events = {
      onTrainModel: vi.fn(),
      onTFVisLogs: vi.fn()
    };

    TFVisorController.init({
      tfVisorView: tfVisorView as never,
      events: events as never
    });

    const onTrainModel = events.onTrainModel.mock.calls[0][0];
    const onTFVisLogs = events.onTFVisLogs.mock.calls[0][0];

    onTrainModel();
    onTFVisLogs({ epoch: 1, loss: 0.2, accuracy: 0.9 });

    expect(tfVisorView.resetDashboard).toHaveBeenCalled();
    expect(tfVisorView.handleTrainingLog).toHaveBeenCalledWith({
      epoch: 1,
      loss: 0.2,
      accuracy: 0.9
    });
  });
});
