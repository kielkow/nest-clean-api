import request from 'supertest'
import { hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Find Question By Slug Controller (E2E)', () => {
  let app: INestApplication, prisma: PrismaService, jwt: JwtService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jonhdoe@email.com',
        password: await hash('12345678', 8),
      },
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    await prisma.question.create({
      data: {
        title: 'How to create a question?',
        content: 'I am having a hard time creating a question.',
        slug: 'how-to-create-a-question',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/how-to-create-a-question`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      title: 'How to create a question?',
      content: 'I am having a hard time creating a question.',
      slug: 'how-to-create-a-question',
      authorId: user.id,
    })
  })
})
