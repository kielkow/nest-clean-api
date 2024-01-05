import { PaginationParams } from '@/core/repositories/pagination-params'

import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract createStudent(question: Student): Promise<Student>

  abstract findById(id: string): Promise<Student | undefined>

  abstract findByEmail(email: string): Promise<Student | undefined>

  abstract deleteStudent(id: string): Promise<void>

  abstract editStudent(question: Student): Promise<void>

  abstract listStudents(params: PaginationParams): Promise<Student[]>
}
