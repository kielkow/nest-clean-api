/* eslint-disable @typescript-eslint/no-unused-vars */

import { Success } from '@/core/response-handling'

import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { Hasher } from '../../cryptography/hasher'

import { CreateStudentUseCase } from '.'

class MockHasher extends Hasher {
  async hash(value: string): Promise<string> {
    return Promise.resolve('hashed_password')
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

describe('CreateStudentUseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasher: Hasher

  let sut: CreateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasher = new MockHasher()

    sut = new CreateStudentUseCase(inMemoryStudentsRepository, hasher)
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
