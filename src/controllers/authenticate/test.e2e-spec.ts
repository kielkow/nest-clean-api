import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/app.module'

describe('Authenticate Controller (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
  })
})
