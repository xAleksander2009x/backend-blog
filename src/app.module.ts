import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { StatusController } from './modules/status/status.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ArticlesModule,
  ],
  controllers: [StatusController],
})
export class AppModule {}
