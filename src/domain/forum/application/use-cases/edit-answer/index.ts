import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'

import { AnswersRepository } from '../../repositories/answers-repository'
import { AnswerAttachmentsRepository } from '../../repositories/answer-attachments-repository'

interface Input {
  id: string
  authorId: string
  content: string
  attachmentsIds?: string[]
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    id,
    authorId,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) return fail(new ResourceNotFoundError())

    if (answer.authorId.id !== authorId) return fail(new NotAllowedError())

    answer.content = content

    if (attachmentsIds) {
      const currentAttachments =
        await this.answerAttachmentsRepository.findByAnswerId(id)

      const answerAttachmentList =
        AnswerAttachmentList.create(currentAttachments)

      const answerAttachments = attachmentsIds.map((attachmentId) => {
        return AnswerAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          answerId: new UniqueEntityID(id),
        })
      })

      answerAttachmentList.update(answerAttachments)

      answer.attachments = answerAttachmentList
    }

    await this.answersRepository.editAnswer(answer)

    return success()
  }
}
