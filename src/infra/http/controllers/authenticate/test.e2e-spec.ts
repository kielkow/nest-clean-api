import request from 'supertest'
import { hash } from 'bcryptjs'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { StudentFactory } from '@/test/factories/make-student'

describe('Authenticate Controller (E2E)', () => {
  let app: INestApplication, studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  it('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(200)
    expect(response.body.access_token).toBeTruthy()
  })
})
