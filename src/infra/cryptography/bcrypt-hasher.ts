import { hash, compare } from 'bcryptjs'

import { Hasher } from '@/domain/forum/application/cryptography/hasher'

export class BcryptHasher implements Hasher {
  private readonly salt: number

  constructor() {
    this.salt = 12
  }

  async hash(value: string) {
    return hash(value, this.salt)
  }

  async compare(value: string, hash: string) {
    return compare(value, hash)
  }
}
