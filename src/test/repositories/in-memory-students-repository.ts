import { PaginationParams } from '@/core/repositories/pagination-params'

import { Student } from '@/domain/forum/enterprise/entities/student'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'

export class InMemoryStudentsRepository implements StudentsRepository {
  private students: Student[] = []

  async createStudent(student: Student): Promise<Student> {
    this.students.push(student)
    return student
  }

  async findById(id: string): Promise<Student | undefined> {
    return this.students.find((student) => student.id === id)
  }

  async findByEmail(email: string): Promise<Student | undefined> {
    return this.students.find((student) => student.email === email)
  }

  async deleteStudent(id: string): Promise<void> {
    this.students = this.students.filter((student) => student.id !== id)
  }

  async editStudent(student: Student): Promise<void> {
    const index = this.students.findIndex((q) => q.id === student.id)
    this.students[index] = student
  }

  async listStudents(params: PaginationParams): Promise<Student[]> {
    const page = params.page || 1
    const perPage = params.perPage || 10

    return this.students
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage)
  }
}
