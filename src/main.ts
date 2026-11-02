import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowed = [
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'https://room-frontend-nu.vercel.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      const isPrivateLan =
        /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/.test(
          origin,
        );

      if (allowed.includes(origin) || isPrivateLan) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
  //pour que le serveur soit accessible depuis l'extérieur
  await app.listen(port, '0.0.0.0');
}

bootstrap();
