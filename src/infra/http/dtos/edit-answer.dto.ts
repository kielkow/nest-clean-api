import { z } from 'zod'

const EditAnswerSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional().default([]),
})

type EditAnswerDTO = z.infer<typeof EditAnswerSchema>

export { EditAnswerSchema, EditAnswerDTO }
