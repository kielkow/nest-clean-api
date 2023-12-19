import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment>

  delete(id: string): Promise<void>

  deleteByAnswerId(answerId: string): Promise<void>

  findByAnswerId(answerId: string): Promise<AnswerAttachment[]>

  findById(id: string): Promise<AnswerAttachment | undefined>
}
