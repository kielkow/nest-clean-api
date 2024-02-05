import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { Public } from '@/infra/auth/public'
import {
  UploadAndCreateAttachmentSchema,
  UploadAndCreateAttachmentDTO,
} from '@/infra/http/dtos/upload-and-create-attachment.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'

@Controller('/create-attachment')
@Public()
export class UploadAndCreateAttachmentController {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(UploadAndCreateAttachmentSchema))
    data: UploadAndCreateAttachmentDTO,
  ) {
    if (
      data.fileType !== 'image/png' &&
      data.fileType !== 'image/jpeg' &&
      data.fileType !== 'image/pdf'
    ) {
      throw new BadRequestException('Invalid file type')
    }

    const { url } = await this.uploader.upload(data)

    const attachment = Attachment.create({
      title: data.fileName,
      type: data.fileType,
      size: data.body.length,
      url,
    })

    await this.attachmentsRepository.create(attachment)
  }
}
