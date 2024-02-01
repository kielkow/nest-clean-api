import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { StudentFactory } from '@/test/factories/make-student'
import { AnswerFactory } from '@/test/factories/make-answer'
import { QuestionFactory } from '@/test/factories/make-question'

describe('Comment on Answer Controller (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
    jwt: JwtService,
    studentFactory: StudentFactory,
    answerFactory: AnswerFactory,
    questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('[POST] /answers/:id/comments', async () => {
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

    const answerCreated = await answerFactory.makePrismaAnswer({
      content: 'I am having a hard time creating a answer.',
      authorId: new UniqueEntityID(user.id),
      questionId: new UniqueEntityID(questionCreated.id),
    })

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerCreated.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'I am having a hard time creating an comment.',
      })

    expect(response.status).toBe(204)

    const comment = await prisma.comment.findFirst({
      where: {
        answerId: answerCreated.id,
        content: 'I am having a hard time creating an comment.',
      },
    })

    expect(comment).toBeTruthy()
  })
})
