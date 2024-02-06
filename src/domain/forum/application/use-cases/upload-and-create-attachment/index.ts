import { Injectable } from '@nestjs/common'

import { InvalidFileTypeError } from '@/core/errors'
import { ResponseHandling, fail, success } from '@/core/response-handling'

import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'

interface UploadAndCreateAttachmentParams {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentResponse = ResponseHandling<
  InvalidFileTypeError,
  Attachment
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute(
    data: UploadAndCreateAttachmentParams,
  ): Promise<UploadAndCreateAttachmentResponse> {
    if (
      data.fileType !== 'image/png' &&
      data.fileType !== 'image/jpeg' &&
      data.fileType !== 'image/pdf'
    ) {
      return fail(new InvalidFileTypeError())
    }

    const { url } = await this.uploader.upload(data)

    const attachment = Attachment.create({
      title: data.fileName,
      type: data.fileType,
      size: data.body.length,
      url,
    })

    const result = await this.attachmentsRepository.create(attachment)

    return success(result)
  }
}
