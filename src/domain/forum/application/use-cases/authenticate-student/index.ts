import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors'
import { ResponseHandling, fail, success } from '@/core/response-handling'

import { StudentsRepository } from '../../repositories/students-repository'
import { Hasher } from '../../cryptography/hasher'
import { AuthenticateError } from './errors/authenticate-error'
import { Encrypter } from '../../cryptography/encrypter'

interface Input {
  email: string
  password: string
}

type Output = ResponseHandling<
  ResourceNotFoundError | AuthenticateError,
  string
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private hasher: Hasher,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const studentExists = await this.studentsRepository.findByEmail(email)
    if (!studentExists) {
      return fail(new ResourceNotFoundError())
    }

    const passwordMatch = await this.hasher.compare(
      password,
      studentExists.password,
    )
    if (!passwordMatch) {
      return fail(new AuthenticateError())
    }

    const acessToken = await this.encrypter.encrypt({ sub: studentExists.id })

    return success(acessToken)
  }
}
