import { hash, compare } from 'bcryptjs'
import { Injectable } from '@nestjs/common'

import { Hasher } from '@/domain/forum/application/cryptography/hasher'

@Injectable()
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
