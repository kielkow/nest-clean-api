import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'

import {
  CreateAccountSchema,
  CreateAccountDTO,
} from '@/dtos/create-account.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccoutController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(CreateAccountSchema))
    data: CreateAccountDTO,
  ) {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists')
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hash(data.password, 8),
      },
    })
  }
}
