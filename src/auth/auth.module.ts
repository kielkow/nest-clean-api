import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { Env } from '@/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      global: true,

      inject: [ConfigService],

      useFactory: async (configService: ConfigService<Env, true>) => {
        const secret = configService.get('JWT_SECRET', { infer: true })
        const expiresIn = configService.get('JWT_EXPIRES_IN', { infer: true })
        const privateKey = configService.get('JWT_PRIVATE_KEY', {
          infer: true,
        })
        const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          secret,
          signOptions: {
            expiresIn,
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
