import { Question } from '@/domain/forum/enterprise/entities/question'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, success } from '@/core/response-handling'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface Input {
  title: string
  content: string
  authorId: string
  attachmentsIds?: string[]
}

type Output = ResponseHandling<void, Question>

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    title,
    content,
    authorId,
    attachmentsIds,
  }: Input): Promise<Output> {
    const questionId = new UniqueEntityID()

    const question = Question.create(
      {
        title,
        content,
        authorId: new UniqueEntityID(authorId),
      },
      questionId,
    )

    if (attachmentsIds) {
      const questionAttachments = attachmentsIds.map((attachmentId) => {
        return QuestionAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          questionId,
        })
      })

      question.attachments = QuestionAttachmentList.create(questionAttachments)
    }

    const result = await this.questionsRepository.createQuestion(question)

    return success(result)
  }
}
