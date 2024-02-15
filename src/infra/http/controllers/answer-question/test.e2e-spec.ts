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
import { AttachmentFactory } from '@/test/factories/make-attachment'

describe('Answer Question Controller (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory,
    attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  it('[POST] /answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.id),
      title: 'How to create a question?',
      content: 'I am having a hard time creating a question.',
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment({
      title: 'attachment1',
      type: 'image/png',
      size: 1000,
      url: 'http://attachment1.com',
    })
    const attachment2 = await attachmentFactory.makePrismaAttachment({
      title: 'attachment2',
      type: 'image/jpeg',
      size: 2000,
      url: 'http://attachment2.com',
    })

    const response = await request(app.getHttpServer())
      .post('/answers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        authorId: user.id,
        questionId: question.id,
        content: 'You should just create a question.',
        attachmentsIds: [attachment1.id, attachment2.id],
      })

    expect(response.status).toBe(201)

    const answer = await prisma.answer.findFirst({
      where: {
        content: response.body.content,
      },
    })
    expect(answer).toBeTruthy()
    expect(answer?.authorId).toBe(user.id)
    expect(answer?.questionId).toBe(question.id)
    expect(answer?.content).toBe('You should just create a question.')

    const answerAttachments = await prisma.attachment.findMany({
      where: {
        answerId: answer?.id,
      },
    })
    expect(answerAttachments).toHaveLength(2)
    expect(answerAttachments[0].id).toBe(attachment1.id)
    expect(answerAttachments[1].id).toBe(attachment2.id)
  })
})
