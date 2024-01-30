import { z } from 'zod'

const CommentOnQuestionSchema = z.object({
  content: z.string(),
})

type CommentOnQuestionDTO = z.infer<typeof CommentOnQuestionSchema>

export { CommentOnQuestionSchema, CommentOnQuestionDTO }
