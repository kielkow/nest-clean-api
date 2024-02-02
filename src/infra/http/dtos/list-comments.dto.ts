import { z } from 'zod'

const ListCommentsSchema = z.object({
  page: z.string().optional().default('1'),
})

type ListCommentsDTO = z.infer<typeof ListCommentsSchema>

export { ListCommentsSchema, ListCommentsDTO }
