import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'

import { CurrentUser } from '@/auth/current-user.decorator'

import {
  CreateQuestionSchema,
  CreateQuestionDTO,
} from '@/dtos/create-question.dto'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

import { PrismaService } from '@/prisma/prisma.service'

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
