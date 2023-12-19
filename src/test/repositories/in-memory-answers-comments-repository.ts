import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  private answersComments: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<AnswerComment> {
    this.answersComments.push(answerComment)
    return answerComment
  }

  async findById(id: string): Promise<AnswerComment | undefined> {
    return this.answersComments.find((answerComment) => answerComment.id === id)
  }

  async findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]> {
    const { page = 1, perPage = 10, answerId } = params

    const start = (page - 1) * perPage
    const end = start + perPage

    const answerComments = this.answersComments.filter(
      (comment) => comment.answerId.id === answerId,
    )

    return answerComments.slice(start, end)
  }

  async delete(id: string): Promise<void> {
    this.answersComments = this.answersComments.filter(
      (answerComment) => answerComment.id !== id,
    )
  }
}
