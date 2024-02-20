import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  private answersComments: AnswerComment[] = []

  constructor(private studentsRepository?: InMemoryStudentsRepository) {}

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

  async findManyByAnswerIdWithAuthor(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<CommentWithAuthor[]> {
    if (!this.studentsRepository) {
      throw new Error('Students repository not found')
    }

    const { page = 1, perPage = 10, answerId } = params

    const start = (page - 1) * perPage
    const end = start + perPage

    const answerComments = this.answersComments
      .filter((comment) => comment.answerId.id === answerId)
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

    return answerComments.slice(start, end)
  }

  async delete(id: string): Promise<void> {
    this.answersComments = this.answersComments.filter(
      (answerComment) => answerComment.id !== id,
    )
  }
}
