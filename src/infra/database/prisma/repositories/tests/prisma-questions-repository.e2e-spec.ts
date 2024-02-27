import { hash } from 'bcryptjs'

import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheRepository } from '@/infra/cache/cache-repository'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication,
    cacheRepository: CacheRepository,
    questionsRepository: QuestionsRepository,
    studentFactory: StudentFactory,
    questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CacheModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('should be use cache on find question details by slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: await hash('12345678', 8),
    })

    const question = await questionFactory.makePrismaQuestion({
      title: 'How to create a question?',
      content: 'I am having a hard time creating a question.',
      slug: Slug.create('how-to-create-a-question'),
      authorId: new UniqueEntityID(user.id),
    })

    const questionDetails = await questionsRepository.findBySlugWithDetails(
      question.slug.value,
    )

    const cachedQuestionDetails = await cacheRepository.get(
      `question:${question.id}:details`,
    )

    expect(cachedQuestionDetails).toBeTruthy()
    expect(cachedQuestionDetails).toEqual(JSON.stringify(questionDetails))
  })
})
