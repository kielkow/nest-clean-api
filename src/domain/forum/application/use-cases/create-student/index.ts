import { Injectable } from '@nestjs/common'

import { Student } from '@/domain/forum/enterprise/entities/student'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, success } from '@/core/response-handling'

import { StudentsRepository } from '../../repositories/students-repository'

interface Input {
  name: string
  email: string
  password: string
}

type Output = ResponseHandling<void, Student>

@Injectable()
export class CreateStudentUseCase {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async execute({ name, email, password }: Input): Promise<Output> {
    const studentId = new UniqueEntityID()

    const student = Student.create(
      {
        name,
        email,
        password,
      },
      studentId,
    )

    const result = await this.studentsRepository.createStudent(student)

    return success(result)
  }
}
