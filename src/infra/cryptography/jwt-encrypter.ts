import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(value: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(value)
  }

  decrypt(value: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(value)
  }
}
