import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'

import { CreateAccountDto } from 'src/dtos/create-account-dto'

import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccoutController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('/create')
  @HttpCode(201)
  async handle(@Body() data: CreateAccountDto) {
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
