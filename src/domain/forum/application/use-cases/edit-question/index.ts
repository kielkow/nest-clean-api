import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

import { QuestionsRepository } from '../../repositories/questions-repository'
import { QuestionAttachmentsRepository } from '../../repositories/question-attachments-repository'

import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'

interface Input {
  id: string
  authorId: string
  title: string
  content: string
  attachmentsIds?: string[]
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    id,
    authorId,
    title,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(id)

    if (!question) return fail(new ResourceNotFoundError())

    if (question.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    question.title = title
    question.content = content

    if (attachmentsIds) {
      const currentAttachments =
        await this.questionAttachmentsRepository.findByQuestionId(id)

      const questionAttachmentList =
        QuestionAttachmentList.create(currentAttachments)

      const questionAttachments = attachmentsIds.map((attachmentId) => {
        return QuestionAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          questionId: new UniqueEntityID(id),
        })
      })

      questionAttachmentList.update(questionAttachments)

      question.attachments = questionAttachmentList
    }

    await this.questionsRepository.editQuestion(question)

    return success()
  }
}
