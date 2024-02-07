import {
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Fail } from '@/core/response-handling'
import { InvalidFileTypeError } from '@/core/errors'

import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'

import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachmentUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    const value = result.getValue()

    if (Fail.is(result) || value instanceof InvalidFileTypeError || !value) {
      return httpErrorsTreatment(result)
    }

    const attachment = value

    return {
      id: attachment.id,
      url: attachment.url,
    }
  }
}
