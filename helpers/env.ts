import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().int().min(1000),
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(5),
});

const values = envSchema.parse(process.env);

export default values;
