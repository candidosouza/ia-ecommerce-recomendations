import { UserService } from './UserService';
import { makeProduct, makeUser } from '../test/factories';

describe('UserService', () => {
  it('carrega usuarios padrao e persiste no sessionStorage', async () => {
    const service = new UserService();

    const users = await service.getDefaultUsers();

    expect(users.length).toBeGreaterThan(0);
    expect(sessionStorage.getItem('ew-academy-users')).not.toBeNull();
  });

  it('adiciona um novo usuario na lista', async () => {
    const service = new UserService();
    await service.getDefaultUsers();

    const newUser = makeUser({ id: 999, name: 'Usuario Novo' });
    await service.addUser(newUser);

    const users = await service.getUsers();
    expect(users[0]).toEqual(newUser);
  });

  it('atualiza compras de um usuario existente', async () => {
    const service = new UserService();
    await service.getDefaultUsers();

    const firstUser = (await service.getUsers())[0];
    const updated = {
      ...firstUser,
      purchases: [...firstUser.purchases, makeProduct({ id: 999 })]
    };

    const result = await service.updateUser(updated);

    expect(result.purchases).toHaveLength(firstUser.purchases.length + 1);
    expect(result.purchases.at(-1)?.id).toBe(999);
  });
});
