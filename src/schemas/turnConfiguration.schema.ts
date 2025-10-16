import * as z from "zod";

/**
 * Schema for turn configuration
 */
export const turnConfigurationSchema = z.object({
    text: z.string()
        .max(5, "Máximo 5 caracteres"),
    startNumber: z.string()
        .min(1, "Introduzca un número")
        .pipe(
            z.coerce.number<string>("El valor no es un número válido")
                .gte(0, "El número debe ser positivo")
                .lte(99999, "Máximo de 5 dígitos")
                .refine(value => Number.isInteger(value), {
                    error: "El número debe ser un entero"
                })
        ),
    digitNumber: z.string()
        .min(1, "Introduzca un número")
        .pipe(
            z.coerce.number<string>("El valor no es un número válido")
                .gte(0, "El valor debe ser positivo")
                .lte(5, "Máximo de 5 dígitos")
                .refine(value => Number.isInteger(value), {
                    error: "El valor debe ser un enterio"
                })
        )
});

/**
 * Type of the schema for turn configuration
 */
export type TurnConfigurationType = z.infer<typeof turnConfigurationSchema>;
