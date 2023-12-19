import { ResponseHandling, fail, success } from '@/core/response-handling'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { NotificationsRepository } from '../../repositories/notifications-repository'

interface Input {
  id: string
  recipientId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ id, recipientId }: Input): Promise<Output> {
    const notification = await this.notificationsRepository.findById(id)

    if (!notification) return fail(new ResourceNotFoundError())

    if (notification.recipientId.id !== recipientId) {
      return fail(new NotAllowedError())
    }

    await this.notificationsRepository.markAsRead(id)

    return success()
  }
}
