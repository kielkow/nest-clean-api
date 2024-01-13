import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

import { EnvHelperModule } from '../env-helper/env-helper.module'
import { EnvHelperService } from '../env-helper/env-helper.service'

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      global: true,

      imports: [EnvHelperModule],

      inject: [EnvHelperService],

      useFactory: async (config: EnvHelperService) => {
        const secret = config.get('JWT_SECRET')
        const expiresIn = config.get('JWT_EXPIRES_IN')
        const privateKey = config.get('JWT_PRIVATE_KEY')
        const publicKey = config.get('JWT_PUBLIC_KEY')

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
    EnvHelperService,
  ],
})
export class AuthModule {}
