/* eslint-disable @typescript-eslint/no-unused-vars */

import { Success } from '@/core/response-handling'

import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { Hasher } from '../../cryptography/hasher'

import { AuthenticateStudentUseCase } from '.'
import { Encrypter } from '../../cryptography/encrypter'
import { makeStudent } from '@/test/factories/make-student'

class MockHasher extends Hasher {
  async hash(value: string): Promise<string> {
    return Promise.resolve('hashed_password')
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class MockEncrypter extends Encrypter {
  async encrypt(value: Record<string, unknown>): Promise<string> {
    return Promise.resolve('access_token')
  }

  async decrypt(value: string): Promise<string> {
    return Promise.resolve('decrypted_value')
  }
}

describe('AuthenticateStudentUseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasher: Hasher
  let encrypter: Encrypter

  let sut: AuthenticateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasher = new MockHasher()
    encrypter = new MockEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      hasher,
      encrypter,
    )
  })

  it('should be able to authenticate an student', async () => {
    const hashPassword = await hasher.hash('12345678')

    const student = await inMemoryStudentsRepository.createStudent(
      makeStudent({
        name: 'John Doe',
        email: 'jonhdoe@email.com',
        password: hashPassword,
      }),
    )

    const result = await sut.execute({
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })
})
