import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

export function makeQuestionAttachmentList(
  questionAttachments: QuestionAttachment[],
): QuestionAttachmentList {
  return QuestionAttachmentList.create(questionAttachments)
}
