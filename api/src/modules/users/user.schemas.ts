import { z } from 'zod';

export const productRefSchema = z.object({
  id: z.number().int().positive()
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2),
  age: z.number().int().min(1).max(120),
  purchases: z.array(productRefSchema).default([])
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2),
  age: z.number().int().min(1).max(120),
  purchases: z.array(productRefSchema).default([])
});
