import { Entity } from '@/core/entities/entity'

interface StudentProps {
  name: string
  email: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  static create(props: StudentProps) {
    const student = new Student(props)
    return student
  }
}
