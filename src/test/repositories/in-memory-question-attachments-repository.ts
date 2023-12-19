import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  private questionAttachments: QuestionAttachment[] = []

  async create(
    questionAttachment: QuestionAttachment,
  ): Promise<QuestionAttachment> {
    this.questionAttachments.push(questionAttachment)
    return questionAttachment
  }

  async delete(id: string): Promise<void> {
    const index = this.questionAttachments.findIndex(
      (questionAttachment) => questionAttachment.id === id,
    )
    this.questionAttachments.splice(index, 1)
  }

  async deleteByQuestionId(questionId: string): Promise<void> {
    this.questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => questionAttachment.questionId.id !== questionId,
    )
  }

  async findByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return this.questionAttachments.filter(
      (questionAttachment) => questionAttachment.questionId.id === questionId,
    )
  }

  async findById(id: string): Promise<QuestionAttachment | undefined> {
    return this.questionAttachments.find(
      (questionAttachment) => questionAttachment.id === id,
    )
  }
}
