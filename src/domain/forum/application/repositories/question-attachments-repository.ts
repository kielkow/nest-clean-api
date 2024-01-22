import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract create(
    questionAttachment: QuestionAttachment,
  ): Promise<QuestionAttachment>

  abstract delete(id: string): Promise<void>

  abstract deleteByQuestionId(questionId: string): Promise<void>

  abstract findByQuestionId(questionId: string): Promise<QuestionAttachment[]>

  abstract findById(id: string): Promise<QuestionAttachment | undefined>
}
