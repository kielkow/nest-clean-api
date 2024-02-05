import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<Attachment>

  abstract delete(id: string): Promise<void>

  abstract findById(id: string): Promise<Attachment | undefined>
}
