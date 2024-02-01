import { z } from 'zod'

const CommentOnAnswerSchema = z.object({
  content: z.string(),
})

type CommentOnAnswerDTO = z.infer<typeof CommentOnAnswerSchema>

export { CommentOnAnswerSchema, CommentOnAnswerDTO }
