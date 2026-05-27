import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { resolve } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './common/config/env.validation';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';
import { MediaModule } from './media/media.module';
import { PagesModule } from './pages/pages.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicModule } from './public/public.module';
import { SettingsModule } from './settings/settings.module';
import { ShelterAnimalsModule } from './shelter-animals/shelter-animals.module';
import { TranslationsModule } from './translations/translations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: [
        resolve(__dirname, '../../../../.env'),
        resolve(process.cwd(), '.env'),
        '.env',
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60,
      },
    ]),
    PrismaModule,
    AuthModule,
    ContactModule,
    HealthModule,
    SettingsModule,
    TranslationsModule,
    PagesModule,
    ShelterAnimalsModule,
    MediaModule,
    PublicModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
