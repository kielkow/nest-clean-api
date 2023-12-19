import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _uniqueEnityId: UniqueEntityID

  protected _props: Props

  private _createdAt: Date

  private _updatedAt?: Date

  get id(): string {
    const { id } = this._uniqueEnityId
    return id
  }

  get props(): Props {
    return this._props
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  set props(value: Props) {
    this._props = value
  }

  set updatedAt(date: Date | undefined) {
    this._updatedAt = date
  }

  protected constructor(props: Props, id?: UniqueEntityID, createdAt?: Date) {
    this._uniqueEnityId = id ?? new UniqueEntityID()

    this._props = props

    this._createdAt = createdAt ?? new Date()

    this._updatedAt = undefined
  }

  public equals(object?: Entity<Props>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!(object instanceof Entity)) {
      return false
    }

    return this._uniqueEnityId === object._uniqueEnityId
  }
}
