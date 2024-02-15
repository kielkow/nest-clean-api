import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment-mapper'

export function makeQuestionAttachment(
  props: QuestionAttachmentProps,
  id?: UniqueEntityID,
): QuestionAttachment {
  return QuestionAttachment.create(props, id)
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    props: QuestionAttachmentProps,
    id?: UniqueEntityID,
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(props, id)

    await this.prisma.attachment.update(
      PrismaQuestionAttachmentMapper.toPersistence(questionAttachment),
    )

    return questionAttachment
  }
}
