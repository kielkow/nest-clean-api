import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super('Resource already exists')

    this.name = 'ResourceAlreadyExistsError'
    this.message = identifier
      ? `Resource already exists: ${identifier}`
      : 'Resource already exists'
  }
}
