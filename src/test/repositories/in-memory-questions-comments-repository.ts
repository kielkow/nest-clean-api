import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'

export class InMemoryQuestionsCommentsRepository
  implements QuestionsCommentsRepository
{
  private questionsComments: QuestionComment[] = []

  async create(questionComment: QuestionComment): Promise<QuestionComment> {
    this.questionsComments.push(questionComment)
    return questionComment
  }

  async findById(id: string): Promise<QuestionComment | undefined> {
    return this.questionsComments.find(
      (questionComment) => questionComment.id === id,
    )
  }

  async findAll(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<QuestionComment[]> {
    const { page = 1, perPage = 10, questionId } = params

    const start = (page - 1) * perPage
    const end = start + perPage

    const questionComments = this.questionsComments.filter(
      (comment) => comment.questionId.id === questionId,
    )

    return questionComments.slice(start, end)
  }

  async delete(id: string): Promise<void> {
    this.questionsComments = this.questionsComments.filter(
      (questionComment) => questionComment.id !== id,
    )
  }
}
