import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  create(questionAttachment: QuestionAttachment): Promise<QuestionAttachment>

  delete(id: string): Promise<void>

  deleteByQuestionId(questionId: string): Promise<void>

  findByQuestionId(questionId: string): Promise<QuestionAttachment[]>

  findById(id: string): Promise<QuestionAttachment | undefined>
}
