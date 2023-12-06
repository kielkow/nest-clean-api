import { z } from 'zod'

const CreateAccountSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
})

type CreateAccountDTO = z.infer<typeof CreateAccountSchema>

export { CreateAccountSchema, CreateAccountDTO }
