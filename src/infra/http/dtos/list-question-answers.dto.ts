import { z } from 'zod'

const ListQuestionAnswersSchema = z.object({
  page: z.string().optional().default('1'),
})

type ListQuestionAnswerDTO = z.infer<typeof ListQuestionAnswersSchema>

export { ListQuestionAnswersSchema, ListQuestionAnswerDTO }
