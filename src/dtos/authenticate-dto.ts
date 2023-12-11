import { z } from 'zod'

const AuthenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type AuthenticateSchemaDTO = z.infer<typeof AuthenticateSchema>

export { AuthenticateSchema, AuthenticateSchemaDTO }
