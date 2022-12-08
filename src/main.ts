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
    .setTitle('GitHub Repo Tracker API')
    .setVersion('1.0')
    .addBearerAuth()
    .setDescription('Quickly keep track of any GitHub repository')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, () =>
    Logger.log('GitHub Repo Tracker API listing on port 3000'),
  );
}
bootstrap();
