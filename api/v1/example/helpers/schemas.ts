import { z } from 'zod';

export const validateLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const validateInsuranceCriteriaSchema = z.object({
    edad: z.number(),
    sumaAsegurada: z.number(),
    sexo: z.string(),
    fumador: z.boolean()
})
