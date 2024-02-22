import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionAttachmentFactory } from '@/test/factories/make-question-attachment'

describe('Find Question By Slug Controller (E2E)', () => {
  let app: INestApplication,
    jwt: JwtService,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory,
    attachmentFactory: AttachmentFactory,
    questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  it('[GET] /questions/:slug', async () => {
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

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'attachment',
      type: 'image/png',
      size: 1000,
      url: 'http://attachment.com',
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: new UniqueEntityID(question.id),
      attachmentId: new UniqueEntityID(attachment.id),
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/how-to-create-a-question`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      title: question.title,
      content: question.content,
      slug: question.slug.value,

      author: {
        id: user.id,
        name: user.name,
      },

      attachments: [
        {
          id: attachment.id,
          title: attachment.title,
          type: attachment.type,
          size: attachment.size,
          url: attachment.url,
        },
      ],

      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
