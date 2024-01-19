import { Injectable } from '@nestjs/common'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    questionAttachment: QuestionAttachment,
  ): Promise<QuestionAttachment> {
    const prismaAttachment = await this.prisma.attachment.create({
      data: PrismaQuestionAttachmentMapper.toPersistence(questionAttachment),
    })

    return PrismaQuestionAttachmentMapper.toDomain(prismaAttachment)
  }

  async findById(id: string): Promise<QuestionAttachment | undefined> {
    const prismaAttachment = await this.prisma.attachment.findUnique({
      where: { id },
    })

    return prismaAttachment
      ? PrismaQuestionAttachmentMapper.toDomain(prismaAttachment)
      : undefined
  }

  async findByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const prismaAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return prismaAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    })
  }

  async deleteByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    })
  }
}
