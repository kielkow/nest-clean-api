import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

import { PrismaService } from '@/prisma/prisma.service'

import {
  ListQuestionsDTO,
  ListQuestionsSchema,
} from '@/dtos/list-questions.dto'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class ListQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(ListQuestionsSchema)) params: ListQuestionsDTO,
  ) {
    const perPage = 10
    const { page } = params

    return this.prisma.question.findMany({
      take: perPage,
      skip: (Number(page) - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
