import { WatchedList } from '@/core/entities/watched-list'

import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  private constructor(initialVotes: AnswerAttachment[]) {
    super(initialVotes)
  }

  public compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.id === b.id
  }

  public static create(
    initialVotes?: AnswerAttachment[],
  ): AnswerAttachmentList {
    return new AnswerAttachmentList(initialVotes || [])
  }
}
