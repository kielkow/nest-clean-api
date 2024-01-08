/* eslint-disable @typescript-eslint/no-unused-vars */

import { Hasher } from '@/domain/forum/application/cryptography/hasher'

export class FakeHasher implements Hasher {
  async hash(value: string): Promise<string> {
    return Promise.resolve(value.concat('-hashed'))
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(value.concat('-hashed') === hash)
  }
}
