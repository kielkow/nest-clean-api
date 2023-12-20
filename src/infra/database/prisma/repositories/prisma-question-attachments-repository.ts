import { Injectable } from '@nestjs/common'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  create(questionAttachment: QuestionAttachment): Promise<QuestionAttachment> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<QuestionAttachment | undefined> {
    throw new Error('Method not implemented.')
  }
}
