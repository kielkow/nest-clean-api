import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { Env } from 'src/env'

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Env, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', { infer: true }),
        },
      }),
    }),
  ],
})
export class AuthModule {}
