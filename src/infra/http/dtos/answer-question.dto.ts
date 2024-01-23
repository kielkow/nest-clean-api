import { z } from 'zod'

const AnswerQuestionSchema = z.object({
  authorId: z.string(),
  questionId: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional().default([]),
})

type AnswerQuestionDTO = z.infer<typeof AnswerQuestionSchema>

export { AnswerQuestionSchema, AnswerQuestionDTO }
