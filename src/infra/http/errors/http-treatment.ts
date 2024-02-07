/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'

import { ResponseHandling } from '@/core/response-handling'

import {
  NotAllowedError,
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
} from '@/core/errors'

type ResponseErrorsType = ResponseHandling<
  ResourceNotFoundError | NotAllowedError | ResourceAlreadyExistsError,
  unknown
>

export const httpErrorsTreatment = (result: ResponseErrorsType) => {
  const error: any = result.getValue()

  switch (error?.constructor) {
    case ResourceNotFoundError:
      throw new ConflictException(error?.message || 'Resource not found')
    case NotAllowedError:
      throw new UnauthorizedException(error?.message || 'Not allowed')
    default:
      throw new BadRequestException(error?.message || 'Bad Request')
  }
}
