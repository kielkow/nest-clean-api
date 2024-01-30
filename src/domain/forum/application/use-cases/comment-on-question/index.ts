import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

import { QuestionsRepository } from '../../repositories/questions-repository'
import { QuestionsCommentsRepository } from '../../repositories/questions-comments-repository'

interface Input {
  questionId: string
  authorId: string
  content: string
}

type Output = ResponseHandling<ResourceNotFoundError, QuestionComment>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionsCommentsRepository: QuestionsCommentsRepository,
  ) {}

  async execute({ questionId, authorId, content }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) return fail(new ResourceNotFoundError())

    const comment = QuestionComment.create({
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    const result = await this.questionsCommentsRepository.create(comment)

    return success(result)
  }
}
