export class Fail<F> {
  readonly error: F

  constructor(error: F) {
    this.error = error
  }

  static is(value: unknown): boolean {
    return value instanceof Fail
  }

  getValue(): F | void {
    return this.error
  }
}

export class Success<S> {
  readonly value: S | void

  constructor(value: S | void) {
    this.value = value
  }

  static is(value: unknown): boolean {
    return value instanceof Success
  }

  getValue(): S | void {
    return this.value
  }
}

export type ResponseHandling<F, S> = Fail<F> | Success<S>

export const fail = <F, S>(value: F): ResponseHandling<F, S> => {
  return new Fail(value)
}

export const success = <F, S>(value: S | void): ResponseHandling<F, S> => {
  return new Success(value)
}
