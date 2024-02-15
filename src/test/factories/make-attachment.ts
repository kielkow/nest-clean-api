import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'

export function makeAttachment(
  props: AttachmentProps,
  id?: UniqueEntityID,
): Attachment {
  return Attachment.create(props, id)
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    props: AttachmentProps,
    id?: UniqueEntityID,
  ): Promise<Attachment> {
    const attachment = makeAttachment(props, id)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistence(attachment),
    })

    return attachment
  }
}
