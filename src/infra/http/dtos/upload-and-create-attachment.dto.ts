import { z } from 'zod'

const bufferSchema = z.custom<Buffer>((value) => Buffer.isBuffer(value), {
  message: 'Invalid Buffer',
})

const UploadAndCreateAttachmentSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  body: bufferSchema,
})

type UploadAndCreateAttachmentDTO = z.infer<
  typeof UploadAndCreateAttachmentSchema
>

export { UploadAndCreateAttachmentSchema, UploadAndCreateAttachmentDTO }
