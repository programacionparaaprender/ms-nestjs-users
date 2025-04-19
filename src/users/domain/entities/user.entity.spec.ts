/* eslint-disable prettier/prettier */
import { User } from './user.entity';

describe('User Entity', () => {
  it('debe crear una instancia válida', () => {
    const user = new User();
    user.id = 1;
    user.nombre = 'Luis';
    user.email = 'luis@example.com';
    user.password = 'hashedPassword';

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(1);
    expect(user.nombre).toBe('Luis');
    expect(user.email).toBe('luis@example.com');
    expect(user.password).toBe('hashedPassword');
  });

  it('debe tener todas las propiedades necesarias', () => {
    const keys = Object.keys(new User());
    expect(keys).toEqual(expect.arrayContaining(['id', 'nombre', 'email', 'password']));
  });
});
