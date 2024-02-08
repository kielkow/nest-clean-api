import { Injectable } from '@nestjs/common'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerAttachment: AnswerAttachment): Promise<AnswerAttachment> {
    const prismaAttachment = await this.prisma.attachment.create({
      data: PrismaAnswerAttachmentMapper.toPersistence(answerAttachment),
    })

    return PrismaAnswerAttachmentMapper.toDomain(prismaAttachment)
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    await this.prisma.attachment.createMany({
      data: answerAttachments.map(PrismaAnswerAttachmentMapper.toPersistence),
    })
  }

  async findById(id: string): Promise<AnswerAttachment | undefined> {
    const prismaAttachment = await this.prisma.attachment.findUnique({
      where: { id },
    })

    return prismaAttachment
      ? PrismaAnswerAttachmentMapper.toDomain(prismaAttachment)
      : undefined
  }

  async findByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const prismaAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    })

    return prismaAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    })
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { id: { in: ids } },
    })
  }

  async deleteByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { answerId },
    })
  }
}
