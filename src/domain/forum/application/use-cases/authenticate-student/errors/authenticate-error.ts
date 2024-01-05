import { UseCaseError } from '@/core/errors/use-case-error'

export class AuthenticateError extends Error implements UseCaseError {
  constructor() {
    super('Authenticate error')

    this.name = 'AuthenticateError'
    this.message = 'Authenticate error'
  }
}
