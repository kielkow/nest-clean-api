import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  private attachments: Attachment[] = []

  async create(attachment: Attachment): Promise<Attachment> {
    this.attachments.push(attachment)
    return attachment
  }

  async delete(id: string): Promise<void> {
    const index = this.attachments.findIndex(
      (attachment) => attachment.id === id,
    )
    this.attachments.splice(index, 1)
  }

  async findById(id: string): Promise<Attachment | undefined> {
    return this.attachments.find((attachment) => attachment.id === id)
  }
}
