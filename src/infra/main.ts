import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvHelperService } from './env-helper/env-helper.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvHelperService)
  const port = envService.get('PORT')

  await app.listen(port)

  console.log(`Listening on port ${port}`)
}
bootstrap()
