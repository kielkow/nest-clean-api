import { Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

import { SendNotificationUseCase } from '.'

describe('SendNotificationUseCase', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send an notification', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityID(),
      title: 'This is the title',
      content: 'This is the notification',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })
})
