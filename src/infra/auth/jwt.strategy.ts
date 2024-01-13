import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { EnvHelperService } from '../env-helper/env-helper.service'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvHelperService) {
    const publicKey = config.get('JWT_PUBLIC_KEY')

    super({
      algorithms: ['RS256'],
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
    })
  }

  async validate(payload: UserPayload) {
    return tokenSchema.parse(payload)
  }
}
