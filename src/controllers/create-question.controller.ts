import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import {
  CreateQuestionSchema,
  CreateQuestionDTO,
} from 'src/dtos/create-question.dto'

import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('/create')
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(CreateQuestionSchema))
    data: CreateQuestionDTO,
  ) {
    return this.prisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.title.toLowerCase().replace(/ /g, '-'),
        authorId: data.authorId,
      },
    })
  }
}
