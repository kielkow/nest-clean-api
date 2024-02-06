import { InvalidFileTypeError } from '@/core/errors'
import { Fail, Success } from '@/core/response-handling'

import { FakeUploader } from '@/test/storage/fake-uploader'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'

import { UploadAndCreateAttachmentUseCase } from '.'

describe('UploadAndCreateAttachmentUseCase', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let uploader: FakeUploader

  let sut: UploadAndCreateAttachmentUseCase

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      uploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'test-file.png',
      fileType: 'image/png',
      body: Buffer.from('test-file'),
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
    expect(uploader.uploads).toHaveLength(1)
  })

  it('should not be able to upload and create an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'test-file.txt',
      fileType: 'text/plain',
      body: Buffer.from('test-file'),
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(InvalidFileTypeError)
    expect(uploader.uploads).toHaveLength(0)
  })
})
