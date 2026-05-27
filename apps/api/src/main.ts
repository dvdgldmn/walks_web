import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { static as serveStatic } from 'express';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT', 4000);
  const uploadsDir = resolve(
    process.cwd(),
    config.get<string>('UPLOADS_DIR', '../../uploads'),
  );

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // CORS allowlist: comma-separated CORS_ORIGINS, or dev defaults.
  const allowedOrigins = (
    config.get<string>('CORS_ORIGINS') ||
    'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    helmet({
      // API serves JSON + /uploads images; allow images to be embedded cross-origin.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin, callback) => {
      // Allow same-origin / server-side / tools (no Origin header) and allowlisted origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  app.use(
    '/uploads',
    serveStatic(uploadsDir, {
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(port);
}

bootstrap();
