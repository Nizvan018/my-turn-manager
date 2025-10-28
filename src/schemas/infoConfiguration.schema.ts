import * as z from "zod";

export const infoConfigurationSchema = z.object({
    title: z.string("El título no es válido"),
    subtitle: z.string("El subtítulo no es válido"),
    instructionsMessage: z.string("Las instrucciones/mensaje no es válido"),
    socialNetworks: z.object({
        instagram: z.string("Inválido"),
        facebook: z.string("Inválido"),
        web: z.string("Inválido")
    })
});

export type InfoConfigurationType = z.infer<typeof infoConfigurationSchema>;
