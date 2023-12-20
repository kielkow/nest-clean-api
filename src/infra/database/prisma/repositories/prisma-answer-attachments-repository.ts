import { Injectable } from '@nestjs/common'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<AnswerAttachment | undefined> {
    throw new Error('Method not implemented.')
  }
}
