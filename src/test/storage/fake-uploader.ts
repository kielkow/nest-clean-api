/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload(params: UploadParams): Promise<{ url: string }> {
    const { fileName } = params
    const url = `http://fake-url.com/${fileName}`

    this.uploads.push({
      fileName,
      url,
    })

    return Promise.resolve({ url })
  }
}
