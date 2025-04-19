/* eslint-disable prettier/prettier */
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('debe ser válido con datos correctos', async () => {
    const dto = new CreateUserDto();
    dto.nombre = 'Luis';
    dto.email = 'luis@example.com';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debe fallar si nombre está vacío', async () => {
    const dto = new CreateUserDto();
    dto.nombre = '';
    dto.email = 'luis@example.com';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'nombre')).toBe(true);
  });

  it('debe fallar si email no es válido', async () => {
    const dto = new CreateUserDto();
    dto.nombre = 'Luis';
    dto.email = 'correo-no-valido';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('debe fallar si password tiene menos de 6 caracteres', async () => {
    const dto = new CreateUserDto();
    dto.nombre = 'Luis';
    dto.email = 'luis@example.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });
});
