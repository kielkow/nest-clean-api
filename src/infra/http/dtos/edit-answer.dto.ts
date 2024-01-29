import { z } from 'zod'

const EditAnswerSchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional().default([]),
})

type EditAnswerDTO = z.infer<typeof EditAnswerSchema>

export { EditAnswerSchema, EditAnswerDTO }
