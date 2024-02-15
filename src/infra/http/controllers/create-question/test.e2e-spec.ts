import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { StudentFactory } from '@/test/factories/make-student'
import { AttachmentFactory } from '@/test/factories/make-attachment'

describe('Create Question Controller (E2E)', () => {
  let app: INestApplication,
    prisma: PrismaService,
    jwt: JwtService,
    studentFactory: StudentFactory,
    attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  it('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const accessToken = jwt.sign({
      sub: user.id,
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
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'How to create a question?',
        content: 'I am having a hard time creating a question.',
        attachments: [attachment1.id, attachment2.id],
      })
    expect(response.status).toBe(201)

    const question = await prisma.question.findFirst({
      where: {
        title: response.body.title,
      },
    })
    expect(question).toBeTruthy()
    expect(question?.authorId).toBe(user.id)
    expect(question?.title).toBe('How to create a question?')
    expect(question?.content).toBe(
      'I am having a hard time creating a question.',
    )

    const questionAttachments = await prisma.attachment.findMany({
      where: {
        questionId: question?.id,
      },
    })
    expect(questionAttachments).toHaveLength(2)
    expect(questionAttachments[0].id).toBe(attachment1.id)
    expect(questionAttachments[1].id).toBe(attachment2.id)
  })
})
