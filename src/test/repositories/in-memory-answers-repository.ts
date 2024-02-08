import { DomainEvents } from '@/core/events/domain-events'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  private answers: Answer[] = []

  constructor(
    private answerAttachmentsRepository?: AnswerAttachmentsRepository,
  ) {}

  async createAnswer(answer: Answer): Promise<Answer> {
    this.answers.push(answer)

    await this.answerAttachmentsRepository?.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchPublisherEventsForAggregate(
      new UniqueEntityID(answer.id),
    )

    return answer
  }

  async findByQuestionID(questionId: string): Promise<Answer[]> {
    return this.answers.filter((answer) => answer.questionId.id === questionId)
  }

  async findById(id: string): Promise<Answer | undefined> {
    return this.answers.find((answer) => answer.id === id)
  }

  async deleteAnswer(id: string): Promise<void> {
    const index = this.answers.findIndex((answer) => answer.id === id)
    this.answers.splice(index, 1)

    if (!this.answerAttachmentsRepository) {
      throw new Error('Answer attachments repository must be provided')
    }

    await this.answerAttachmentsRepository.deleteByAnswerId(id)
  }

  async editAnswer(answer: Answer): Promise<void> {
    const index = this.answers.findIndex((a) => a.id === answer.id)
    this.answers[index] = answer

    await this.answerAttachmentsRepository?.createMany(
      this.answers[index].attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository?.deleteMany(
      this.answers[index].attachments
        .getRemovedItems()
        .map((attachment) => attachment.id),
    )

    DomainEvents.dispatchPublisherEventsForAggregate(
      new UniqueEntityID(answer.id),
    )
  }

  async listQuetionAnswers(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<Answer[]> {
    const { page = 1, perPage = 10, questionId } = params

    const start = (page - 1) * perPage
    const end = start + perPage

    const answers = this.answers.filter(
      (answer) => answer.questionId.id === questionId,
    )

    return answers.slice(start, end)
  }
}
