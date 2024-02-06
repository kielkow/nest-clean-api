import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidFileTypeError extends Error implements UseCaseError {
  constructor() {
    super('Invalid file type error')

    this.name = 'InvalidFileTypeError'
    this.message = 'Invalid file type error'
  }
}
