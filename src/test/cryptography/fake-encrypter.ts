/* eslint-disable @typescript-eslint/no-unused-vars */

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(value: Record<string, unknown>): Promise<string> {
    return Promise.resolve('access_token')
  }

  async decrypt(value: string): Promise<Record<string, unknown>> {
    return Promise.resolve({ id: 'user_id' })
  }
}
