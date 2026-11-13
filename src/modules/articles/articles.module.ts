import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { GetArticleByIdHandler } from './application/query/get-article-by-id.query';
import { GetArticlesHandler } from './application/query/get-articles.query';
import { ArticlesController } from './infra/articles.controller';
import { PrismaArticleRepository } from './infra/prisma/prisma-article.repository';
import { ArticleRepository } from './model/article.repository';

const QueryHandlers = [GetArticlesHandler, GetArticleByIdHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ArticlesController],
  providers: [
    ...QueryHandlers,
    {
      provide: ArticleRepository,
      useClass: PrismaArticleRepository,
    },
  ],
})
export class ArticlesModule {}
