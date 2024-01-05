import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeStudent(props: StudentProps, id?: UniqueEntityID): Student {
  return Student.create(props, id)
}
