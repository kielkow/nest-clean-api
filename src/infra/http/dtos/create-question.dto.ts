import { z } from 'zod'

const CreateQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>

export { CreateQuestionSchema, CreateQuestionDTO }