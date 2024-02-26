import { z } from 'zod';

export const validateLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const sexoEnum = z.enum(["M", "F"])

export const validateInsuranceCriteriaSchema = z.object({
    edad: z.number().refine( value => value > 18 && value < 66, {
      message: "La edad debe ser mayor a 0 y menor a 105"
    }),
    sumaAsegurada: z.number().refine( value => value > 0, {
      message: "La suma asegurada debe ser mayor a 0"
    }),
    sexo: sexoEnum,
    fumador: z.boolean()
})
