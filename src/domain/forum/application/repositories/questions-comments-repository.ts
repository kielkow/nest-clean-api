import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionsCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<QuestionComment>

  abstract findById(id: string): Promise<QuestionComment | undefined>

  abstract findAll(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<CommentWithAuthor[]>

  abstract delete(id: string): Promise<void>
}
