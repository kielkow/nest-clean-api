import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'

import { CurrentUser } from 'src/auth/current-user.decorator'

import {
  CreateQuestionSchema,
  CreateQuestionDTO,
} from 'src/dtos/create-question.dto'

import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,

    @Body(new ZodValidationPipe(CreateQuestionSchema))
    data: CreateQuestionDTO,
  ) {
    return this.prisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        slug: convertToSlug(data.title),
        authorId: user.sub,
      },
    })
  }
}

function convertToSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}
