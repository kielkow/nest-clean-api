import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, fail, success } from '@/core/response-handling'

import { AnswersRepository } from '../../repositories/answers-repository'
import { QuestionsRepository } from '../../repositories/questions-repository'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

interface Input {
  authorId: string
  answerId: string
  questionId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute({ authorId, answerId, questionId }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) return fail(new ResourceNotFoundError())

    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return fail(new ResourceNotFoundError())

    if (answer.questionId.id !== questionId) {
      return fail(new NotAllowedError())
    }

    if (question.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    question.bestAnswerId = new UniqueEntityID(answerId)

    await this.questionsRepository.editQuestion(question)

    return success()
  }
}
