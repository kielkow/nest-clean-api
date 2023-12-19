import { Entity } from '@/core/entities/entity'

interface InstructorProps {
  name: string
  email: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  static create(props: InstructorProps) {
    const instructor = new Instructor(props)
    return instructor
  }
}
