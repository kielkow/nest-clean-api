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

describe('Edit Answer Controller (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
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

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  it('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    const question = await questionFactory.makePrismaQuestion({
      title: 'How to create a answer?',
      content: 'I am having a hard time creating a answer.',
      authorId: new UniqueEntityID(user.id),
    })

    const answerCreated = await answerFactory.makePrismaAnswer({
      content: 'I am having a hard time creating a answer.',
      authorId: new UniqueEntityID(user.id),
      questionId: new UniqueEntityID(question.id),
    })

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerCreated.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'I am having a hard time editing a answer.',
      })

    expect(response.status).toBe(204)

    const answer = await prisma.answer.findFirst({
      where: {
        content: 'I am having a hard time editing a answer.',
      },
    })

    expect(answer).toBeTruthy()
  })
})
