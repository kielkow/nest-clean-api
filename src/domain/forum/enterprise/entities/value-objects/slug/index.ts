import { ValueObject } from '@/core/entities/value-object'

export interface SlugProps {
  value: string
}

export class Slug extends ValueObject<SlugProps> {
  public value: string

  private constructor(value: string) {
    super({ value })
    this.value = value
  }

  static create(value: string) {
    return new Slug(value)
  }

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
