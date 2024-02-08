import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  private answerAttachments: AnswerAttachment[] = []

  async create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment> {
    this.answerAttachments.push(answerAttachment)
    return answerAttachment
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    this.answerAttachments.push(...answerAttachments)
  }

  async delete(id: string): Promise<void> {
    const index = this.answerAttachments.findIndex(
      (answerAttachment) => answerAttachment.id === id,
    )
    this.answerAttachments.splice(index, 1)
  }

  async deleteMany(ids: string[]): Promise<void> {
    this.answerAttachments = this.answerAttachments.filter(
      (answerAttachment) => !ids.includes(answerAttachment.id),
    )
  }

  async deleteByAnswerId(answerId: string): Promise<void> {
    this.answerAttachments = this.answerAttachments.filter(
      (answerAttachment) => answerAttachment.answerId.id !== answerId,
    )
  }

  async findByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.answerAttachments.filter(
      (answerAttachment) => answerAttachment.answerId.id === answerId,
    )
  }

  async findById(id: string): Promise<AnswerAttachment | undefined> {
    return this.answerAttachments.find(
      (answerAttachment) => answerAttachment.id === id,
    )
  }
}
