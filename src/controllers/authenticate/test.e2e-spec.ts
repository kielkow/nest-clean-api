import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

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

  it('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)

    const user = await prisma.user.findUnique({
      where: {
        email: response.body.email,
      },
    })

    expect(user).toBeTruthy()
  })
})
