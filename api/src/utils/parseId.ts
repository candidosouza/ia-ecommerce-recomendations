import { AppError } from '../errors/AppError';

export function parseId(value: string | string[]) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(normalizedValue);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('Identificador invalido.', 400);
  }

  return parsed;
}
