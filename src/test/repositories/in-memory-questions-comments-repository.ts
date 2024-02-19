import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsCommentsRepository
  implements QuestionsCommentsRepository
{
  private questionsComments: QuestionComment[] = []

  constructor(private studentsRepository?: InMemoryStudentsRepository) {}

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

  async findManyByQuestionIdWithAuthor(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<CommentWithAuthor[]> {
    if (!this.studentsRepository) {
      throw new Error('Students repository not found')
    }

    const { page = 1, perPage = 10, questionId } = params

    const start = (page - 1) * perPage
    const end = start + perPage

    const questionComments = this.questionsComments
      .filter((comment) => comment.questionId.id === questionId)
      .map((comment) => {
        return CommentWithAuthor.create({
          author: {
            id: comment.authorId.id,
            name:
              this.studentsRepository?.students.find(
                (student) => student.id === comment.authorId.id,
              )?.name || 'Unknown',
          },
          comment: {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          },
        })
      })

    return questionComments.slice(start, end)
  }

  async delete(id: string): Promise<void> {
    this.questionsComments = this.questionsComments.filter(
      (questionComment) => questionComment.id !== id,
    )
  }
}
