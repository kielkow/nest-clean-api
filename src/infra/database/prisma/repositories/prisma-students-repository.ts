import { Injectable } from '@nestjs/common'

import { Student } from '@/domain/forum/enterprise/entities/student'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'

import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}
  async createStudent(student: Student): Promise<Student> {
    const studentCreated = await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    })

    return PrismaStudentMapper.toDomain(studentCreated)
  }

  async findById(id: string): Promise<Student | undefined> {
    const student = await this.prisma.user.findUnique({
      where: { id, role: 'STUDENT' },
    })

    return student ? PrismaStudentMapper.toDomain(student) : undefined
  }

  async findByEmail(email: string): Promise<Student | undefined> {
    const student = await this.prisma.user.findUnique({
      where: { email, role: 'STUDENT' },
    })

    return student ? PrismaStudentMapper.toDomain(student) : undefined
  }

  async deleteStudent(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id, role: 'STUDENT' },
    })
  }

  async editStudent(student: Student): Promise<void> {
    await this.prisma.user.update({
      where: { id: student.id, role: 'STUDENT' },
      data: PrismaStudentMapper.toPersistence(student),
    })
  }

  async listStudents(params: PaginationParams): Promise<Student[]> {
    const { page = 1, perPage = 10 } = params

    const prismaStudents = await this.prisma.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
    })

    const students = prismaStudents.map(PrismaStudentMapper.toDomain)

    return students
  }
}
