import { z } from 'zod'

const EditQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional().default([]),
})

type EditQuestionDTO = z.infer<typeof EditQuestionSchema>

export { EditQuestionSchema, EditQuestionDTO }
