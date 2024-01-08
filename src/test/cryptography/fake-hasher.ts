/* eslint-disable @typescript-eslint/no-unused-vars */

import { Hasher } from '@/domain/forum/application/cryptography/hasher'

export class FakeHasher extends Hasher {
  async hash(value: string): Promise<string> {
    return Promise.resolve('hashed_password')
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}
