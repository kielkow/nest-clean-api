import { Success } from '@/core/response-handling'

import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { CreateStudentUseCase } from '.'

describe('CreateStudentUseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: CreateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new CreateStudentUseCase(inMemoryStudentsRepository)
  })

  it('should be able to create an student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })
})
