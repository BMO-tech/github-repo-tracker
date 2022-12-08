import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.use(rateLimit({ windowMs: 60000, max: 100 }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Github Repo Tracker API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = +process.env.API_PORT || 3000;

  await app.listen(port, () =>
    Logger.log(`Github Repo Tracker API listing on port ${port}`),
  );
}
bootstrap();
