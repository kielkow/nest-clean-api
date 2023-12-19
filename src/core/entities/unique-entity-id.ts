import { randomUUID } from 'crypto'

export class UniqueEntityID {
  private _id: string

  get id(): string {
    return this._id
  }

  constructor(id?: string) {
    this._id = id ?? randomUUID()
  }

  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false
    }

    if (this === id) {
      return true
    }

    if (!(id instanceof UniqueEntityID)) {
      return false
    }

    return this._id === id._id
  }
}
