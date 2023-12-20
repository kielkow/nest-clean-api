import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

import {
  AuthenticateSchema,
  AuthenticateSchemaDTO,
} from '@/dtos/authenticate.dto'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(AuthenticateSchema))
    data: AuthenticateSchemaDTO,
  ) {
    const { email, password } = data

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new UnauthorizedException('User credentials are invalid')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials are invalid')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
