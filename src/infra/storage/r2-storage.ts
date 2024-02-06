import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'

import { EnvHelperService } from '../env-helper/env-helper.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private config: EnvHelperService) {
    this.client = new S3Client({
      endpoint: `https://${config.get(
        'STORAGE_CLOUDFLARE_ID',
      )}.r2.cloudflarestorage.com`,

      region: 'auto',

      credentials: {
        accessKeyId: config.get('STORAGE_S3_ACCESS_KEY_ID'),
        secretAccessKey: config.get('STORAGE_S3_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = `${fileName}-${Date.now()}-${randomUUID()}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.get('STORAGE_S3_BUCKET'),
        Key: uploadId,
        Body: body,
        ContentType: fileType,
      }),
    )

    return { url: uploadId }
  }
}
