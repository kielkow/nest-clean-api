import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'
import { AnswerFactory } from '@/test/factories/make-answer'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('List Question Answers Controller (E2E)', () => {
  let app: INestApplication,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory,
    answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  it('[GET] /questions/:id/answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    const question = await questionFactory.makePrismaQuestion({
      title: 'How to create a question?',
      content: 'I am having a hard time creating a question.',
      slug: Slug.create('how-to-create-a-question'),
      authorId: new UniqueEntityID(user.id),
    })

    await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(question.id),
        content: 'I am having a hard time creating my first answer.',
      }),
      answerFactory.makePrismaAnswer({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(question.id),
        content: 'I am having a hard time creating my second answer.',
      }),
      answerFactory.makePrismaAnswer({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(question.id),
        content: 'I am having a hard time creating my third answer.',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })
})
