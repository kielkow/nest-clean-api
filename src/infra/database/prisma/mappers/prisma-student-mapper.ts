import { Prisma, User as PrismaStudent } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Student } from '@/domain/forum/enterprise/entities/student'

export class PrismaStudentMapper {
  static toDomain(prismaStudent: PrismaStudent): Student {
    const { id, name, email, password, createdAt, updatedAt } = prismaStudent

    const domainId = new UniqueEntityID(id)

    return Student.create(
      {
        name,
        email,
        password,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      password: student.password,
      role: 'STUDENT',
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }
  }
}
