import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { Env } from '@/infra/env'

import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

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
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
