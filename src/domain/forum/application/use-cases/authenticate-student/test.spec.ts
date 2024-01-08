import { Fail, Success } from '@/core/response-handling'

import { makeStudent } from '@/test/factories/make-student'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { Hasher } from '../../cryptography/hasher'
import { Encrypter } from '../../cryptography/encrypter'

import { AuthenticateStudentUseCase } from '.'

describe('AuthenticateStudentUseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasher: Hasher
  let encrypter: Encrypter

  let sut: AuthenticateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      hasher,
      encrypter,
    )
  })

  it('should be able to authenticate an student', async () => {
    const hashPassword = await hasher.hash('12345678')

    await inMemoryStudentsRepository.createStudent(
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

    const acessToken = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
    expect(acessToken).toStrictEqual(expect.any(String))
  })

  it('should not be able to authenticate an student that not exists', async () => {
    const result = await sut.execute({
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
  })

  it('should not be able to authenticate an student with wrong password', async () => {
    const hashPassword = await hasher.hash('12345678')

    await inMemoryStudentsRepository.createStudent(
      makeStudent({
        name: 'John Doe',
        email: 'jonhdoe@email.com',
        password: hashPassword,
      }),
    )

    const result = await sut.execute({
      email: 'jonhdoe@email.com',
      password: 'wrong-password',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
  })
})
