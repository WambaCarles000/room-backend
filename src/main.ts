import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const app = await NestFactory.create(AppModule);

  // CORS pour permettre les appels depuis le frontend(100 % permissif)
  // app.enableCors();
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://room-frontend-nu.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true, ONLY WHEN YOU NEED TO SEND COOKIES
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Room API')
    .setDescription('API pour l’application Room')
    .setVersion('1.0')
    .addTag('room')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
