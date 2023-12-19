import { ResponseHandling, success, fail } from '@/core/response-handling'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswersRepository } from '../../repositories/answers-repository'
import { AnswersCommentsRepository } from '../../repositories/answers-comments-repository'

import { ResourceNotFoundError } from '@/core/errors'

interface Input {
  answerId: string
  authorId: string
  content: string
}

type Output = ResponseHandling<ResourceNotFoundError, AnswerComment>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answersCommentsRepository: AnswersCommentsRepository,
  ) {}

  async execute({ answerId, authorId, content }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) return fail(new ResourceNotFoundError())

    const comment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    const result = await this.answersCommentsRepository.create(comment)

    return success(result)
  }
}
