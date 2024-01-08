import { Fail, Success } from '@/core/response-handling'

import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { Hasher } from '../../cryptography/hasher'

import { CreateStudentUseCase } from '.'

describe('CreateStudentUseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasher: Hasher

  let sut: CreateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()

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

  it('should not be able to create an student that e-mail already exists', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
  })

  it('should be able to hash student password', async () => {
    const password = '12345678'

    const hashSpy = vi.spyOn(hasher, 'hash')

    const result = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password,
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(hashSpy).toHaveBeenCalledWith('12345678')
    expect(inMemoryStudentsRepository.students[0].password).toBe(
      await hasher.hash(password),
    )
  })
})
