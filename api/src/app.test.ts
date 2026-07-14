import request from 'supertest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn()
    },
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    }
  }
}));

vi.mock('./lib/prisma', () => ({
  prisma: prismaMock
}));

import { createApp } from './app';

describe('API app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna healthcheck com sucesso', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('lista produtos', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, name: 'Produto', category: 'cat', price: 10, color: 'azul' }
    ]);
    const app = createApp();
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('retorna 400 para id de produto invalido', async () => {
    const app = createApp();
    const response = await request(app).get('/api/products/abc');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Identificador invalido.');
  });

  it('retorna 404 para produto inexistente', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const app = createApp();
    const response = await request(app).get('/api/products/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto nao encontrado.');
  });

  it('lista usuarios', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Ana',
        age: 20,
        purchases: [
          {
            product: { id: 1, name: 'Produto', category: 'cat', price: 10, color: 'azul' }
          }
        ]
      }
    ]);
    const app = createApp();
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body[0].purchases).toHaveLength(1);
  });

  it('retorna 404 para usuario inexistente', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const app = createApp();
    const response = await request(app).get('/api/users/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuario nao encontrado.');
  });

  it('retorna 400 para payload invalido ao criar usuario', async () => {
    const app = createApp();
    const response = await request(app).post('/api/users').send({
      name: '',
      age: -1,
      purchases: []
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Payload invalido.');
  });

  it('retorna 400 quando produto informado nao existe ao criar usuario', async () => {
    prismaMock.product.count.mockResolvedValue(0);
    const app = createApp();
    const response = await request(app).post('/api/users').send({
      name: 'Usuario Novo',
      age: 30,
      purchases: [{ id: 1 }]
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Um ou mais produtos informados nao existem.');
  });

  it('retorna 400 para id de usuario invalido ao atualizar', async () => {
    const app = createApp();
    const response = await request(app).put('/api/users/abc').send({
      name: 'Usuario',
      age: 30,
      purchases: []
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Identificador invalido.');
  });
});
