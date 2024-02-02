import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'
import { QuestionCommentFactory } from '@/test/factories/make-question-comment'

describe('List Question Comments Controller (E2E)', () => {
  let app: INestApplication,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory,
    questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  it('[GET] /questions/:id/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    const questionCreated = await questionFactory.makePrismaQuestion({
      title: 'How to create a question?',
      content: 'I am having a hard time creating a question.',
      authorId: new UniqueEntityID(user.id),
    })

    await Promise.all([
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(questionCreated.id),
        content: 'I am having a hard time creating a question.',
      }),
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(questionCreated.id),
        content: 'I am having a hard time creating a question.',
      }),
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: new UniqueEntityID(user.id),
        questionId: new UniqueEntityID(questionCreated.id),
        content: 'I am having a hard time creating a question.',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionCreated.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })
})
