import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment>

  abstract createMany(answerAttachments: AnswerAttachment[]): Promise<void>

  abstract delete(id: string): Promise<void>

  abstract deleteMany(ids: string[]): Promise<void>

  abstract deleteByAnswerId(answerId: string): Promise<void>

  abstract findByAnswerId(answerId: string): Promise<AnswerAttachment[]>

  abstract findById(id: string): Promise<AnswerAttachment | undefined>
}
