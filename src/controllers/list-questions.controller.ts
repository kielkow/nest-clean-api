import { Controller, Get, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class ListQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle() {
    return this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
