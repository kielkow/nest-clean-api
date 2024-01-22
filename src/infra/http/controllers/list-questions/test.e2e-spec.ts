import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('List Questions Controller (E2E)', () => {
  let app: INestApplication,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        title: 'How to create a question?',
        content: 'I am having a hard time creating a question.',
        slug: Slug.create('how-to-create-a-question'),
        authorId: new UniqueEntityID(user.id),
      }),
      questionFactory.makePrismaQuestion({
        title: 'How to create a question?',
        content: 'I am having a hard time creating a question.',
        slug: Slug.create('how-to-create-a-question-2'),
        authorId: new UniqueEntityID(user.id),
      }),
      questionFactory.makePrismaQuestion({
        title: 'How to create a question?',
        content: 'I am having a hard time creating a question.',
        slug: Slug.create('how-to-create-a-question-3'),
        authorId: new UniqueEntityID(user.id),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })
})
