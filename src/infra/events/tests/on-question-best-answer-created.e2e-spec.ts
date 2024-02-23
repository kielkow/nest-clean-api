import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { DomainEvents } from '@/core/events/domain-events'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { AnswerFactory } from '@/test/factories/make-answer'
import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'

import { waitFor } from '@/test/utils/wait-for'

describe('Event On Question Best Answer Created (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
    jwt: JwtService,
    answerFactory: AnswerFactory,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    answerFactory = moduleRef.get(AnswerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    DomainEvents.shouldDispatchEvents = true

    await app.init()
  })

  it('should send notification on question best answer be created', async () => {
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
      content: 'I am having a hard time creating a question.',
      authorId: new UniqueEntityID(user.id),
      questionId: new UniqueEntityID(questionCreated.id),
    })

    await request(app.getHttpServer())
      .patch(`/questions/${questionCreated.id}/best-answer/${answerCreated.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: user.id,
        },
      })

      expect(notification).toBeTruthy()
    }, 3000)
  })
})
