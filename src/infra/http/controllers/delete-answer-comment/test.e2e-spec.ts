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
import { QuestionFactory } from '@/test/factories/make-question'
import { AnswerCommentFactory } from '@/test/factories/make-answer-comment'
import { AnswerFactory } from '@/test/factories/make-answer'

describe('Delete Answer Comment Controller (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory,
    answerFactory: AnswerFactory,
    answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  it('[DELETE] /answers/comments/:id', async () => {
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

    const commentCreated = await answerCommentFactory.makePrismaAnswerComment({
      authorId: new UniqueEntityID(user.id),
      answerId: new UniqueEntityID(answerCreated.id),
      content: 'I am having a hard time creating a question.',
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${commentCreated.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(204)

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentCreated.id,
        answerId: answerCreated.id,
      },
    })

    expect(comment).toBeNull()
  })
})
