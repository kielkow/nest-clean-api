import { z } from 'zod'

const ListQuestionsSchema = z.object({
  page: z.string().optional().default('1'),
})

type ListQuestionsDTO = z.infer<typeof ListQuestionsSchema>

export { ListQuestionsSchema, ListQuestionsDTO }
