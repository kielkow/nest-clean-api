import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment>

  abstract delete(id: string): Promise<void>

  abstract deleteByAnswerId(answerId: string): Promise<void>

  abstract findByAnswerId(answerId: string): Promise<AnswerAttachment[]>

  abstract findById(id: string): Promise<AnswerAttachment | undefined>
}
