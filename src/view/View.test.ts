import { View } from './View';

describe('View', () => {
  it('substitui placeholders no template', () => {
    const view = new View();

    const result = view['replaceTemplate']('Hello {{name}} - {{age}}', {
      name: 'Maria',
      age: 30
    });

    expect(result).toBe('Hello Maria - 30');
  });
});
