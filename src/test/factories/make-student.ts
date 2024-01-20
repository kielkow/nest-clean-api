import { Injectable } from '@nestjs/common'

import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'

export function makeStudent(props: StudentProps, id?: UniqueEntityID): Student {
  return Student.create(props, id)
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    props: StudentProps,
    id?: UniqueEntityID,
  ): Promise<Student> {
    const student = makeStudent(props, id)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    })

    return student
  }
}
