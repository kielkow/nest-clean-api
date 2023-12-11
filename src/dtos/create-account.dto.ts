import { z } from 'zod'

const CreateAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateAccountDTO = z.infer<typeof CreateAccountSchema>

export { CreateAccountSchema, CreateAccountDTO }
