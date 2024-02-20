import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswersCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<AnswerComment>

  abstract findById(id: string): Promise<AnswerComment | undefined>

  abstract findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<CommentWithAuthor[]>

  abstract delete(id: string): Promise<void>
}
