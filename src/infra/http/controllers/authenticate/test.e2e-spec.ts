import request from 'supertest'
import { hash } from 'bcryptjs'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Authenticate Controller (E2E)', () => {
  let app: INestApplication, prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jonhdoe@email.com',
        password: await hash('12345678', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(200)
    expect(response.body.access_token).toBeTruthy()
  })
})
