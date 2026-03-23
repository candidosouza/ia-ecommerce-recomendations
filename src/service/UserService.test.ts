import { UserService } from './UserService';
import { makeProduct, makeUser } from '../test/factories';

describe('UserService', () => {
  it('carrega usuarios padrao pela API', async () => {
    const service = new UserService();
    const usersPayload = [makeUser()];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(usersPayload), {
          status: 200
        })
      )
    );

    const users = await service.getDefaultUsers();

    expect(users).toEqual(usersPayload);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('adiciona um novo usuario pela API', async () => {
    const newUser = makeUser({ id: 999, name: 'Usuario Novo' });
    const service = new UserService();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(newUser), {
          status: 201
        })
      )
    );

    const created = await service.addUser(newUser);

    expect(created).toEqual(newUser);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/users',
      expect.objectContaining({
        method: 'POST'
      })
    );
  });

  it('atualiza compras de um usuario existente pela API', async () => {
    const firstUser = makeUser();
    const updated = {
      ...firstUser,
      purchases: [...firstUser.purchases, makeProduct({ id: 999 })]
    };
    const service = new UserService();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(updated), {
          status: 200
        })
      )
    );

    const result = await service.updateUser(updated);

    expect(result).toEqual(updated);
    expect(result.purchases.at(-1)?.id).toBe(999);
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:4000/api/users/${updated.id}`,
      expect.objectContaining({
        method: 'PUT'
      })
    );
  });
});
