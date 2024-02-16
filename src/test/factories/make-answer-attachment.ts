import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-answer-attachment-mapper'

export function makeAnswerAttachment(
  props: AnswerAttachmentProps,
  id?: UniqueEntityID,
): AnswerAttachment {
  return AnswerAttachment.create(props, id)
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    props: AnswerAttachmentProps,
    id?: UniqueEntityID,
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(props, id)

    await this.prisma.attachment.update(
      PrismaAnswerAttachmentMapper.toPersistence(answerAttachment),
    )

    return answerAttachment
  }
}
