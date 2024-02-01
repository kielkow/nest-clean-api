import { z } from 'zod'

const ListAnswerCommentsSchema = z.object({
  page: z.string().optional().default('1'),
})

type ListAnswerCommentsDTO = z.infer<typeof ListAnswerCommentsSchema>

export { ListAnswerCommentsSchema, ListAnswerCommentsDTO }
