import { Injectable } from '@nestjs/common'

import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<Attachment> {
    const prismaAttachment = await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistence(attachment),
    })

    return PrismaAttachmentMapper.toDomain(prismaAttachment)
  }

  async findById(id: string): Promise<Attachment | undefined> {
    const prismaAttachment = await this.prisma.attachment.findUnique({
      where: { id },
    })

    return prismaAttachment
      ? PrismaAttachmentMapper.toDomain(prismaAttachment)
      : undefined
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    })
  }
}
