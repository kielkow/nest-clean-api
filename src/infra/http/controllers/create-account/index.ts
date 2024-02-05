import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { Public } from '@/infra/auth/public'
import {
  CreateAccountSchema,
  CreateAccountDTO,
} from '@/infra/http/dtos/create-account.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(CreateAccountSchema))
    data: CreateAccountDTO,
  ) {
    const result = await this.createStudentUseCase.execute(data)

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
