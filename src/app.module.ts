import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { CreateAccoutController } from './controllers/create-account.controller'

@Module({
  imports: [],
  controllers: [CreateAccoutController],
  providers: [PrismaService],
})
export class AppModule {}
