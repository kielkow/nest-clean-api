import { Injectable } from '@nestjs/common'

import { Student } from '@/domain/forum/enterprise/entities/student'

import { ResourceAlreadyExistsError } from '@/core/errors'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, fail, success } from '@/core/response-handling'

import { StudentsRepository } from '../../repositories/students-repository'
import { Hasher } from '../../cryptography/hasher'

interface Input {
  name: string
  email: string
  password: string
}

type Output = ResponseHandling<ResourceAlreadyExistsError, Student>

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private hasher: Hasher,
  ) {}

  async execute({ name, email, password }: Input): Promise<Output> {
    const studentAlreadyExists = await this.studentsRepository.findByEmail(
      email,
    )

    if (studentAlreadyExists) {
      return fail(new ResourceAlreadyExistsError(email))
    }

    const studentId = new UniqueEntityID()

    const student = Student.create(
      {
        name,
        email,
        password: await this.hasher.hash(password),
      },
      studentId,
    )

    const result = await this.studentsRepository.createStudent(student)

    return success(result)
  }
}
