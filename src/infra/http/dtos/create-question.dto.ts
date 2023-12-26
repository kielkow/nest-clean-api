import { z } from 'zod'

const CreateQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional().default([]),
})

type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>

export { CreateQuestionSchema, CreateQuestionDTO }
