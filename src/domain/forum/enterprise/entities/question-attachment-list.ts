import { WatchedList } from '@/core/entities/watched-list'

import { QuestionAttachment } from './question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  private constructor(initialVotes: QuestionAttachment[]) {
    super(initialVotes)
  }

  public compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.id === b.id
  }

  public static create(
    initialVotes?: QuestionAttachment[],
  ): QuestionAttachmentList {
    return new QuestionAttachmentList(initialVotes || [])
  }
}
