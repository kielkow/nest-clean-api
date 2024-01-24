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
  const error = result.getValue()

  switch (error?.constructor) {
    case ResourceNotFoundError:
      throw new ConflictException(error)
    case NotAllowedError:
      throw new UnauthorizedException(error)
    default:
      throw new BadRequestException()
  }
}
