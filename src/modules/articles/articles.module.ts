import { PrismaModule } from 'src/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateArticleHandler } from './application/command/create-article.command';
import { DeleteArticleHandler } from './application/command/delete-article.command';
import { UpdateArticleHandler } from './application/command/update-article.command';
import { GetArticleByIdHandler } from './application/query/get-article-by-id.query';
import { GetArticlesHandler } from './application/query/get-articles.query';
import { ArticlesController } from './infra/articles.controller';
import { PrismaArticleRepository } from './infra/prisma/prisma-article.repository';
import { ArticleRepository } from './model/article.repository';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ArticlesController],
  providers: [
    GetArticlesHandler,
    GetArticleByIdHandler,
    CreateArticleHandler,
    UpdateArticleHandler,
    DeleteArticleHandler,
    {
      provide: ArticleRepository,
      useClass: PrismaArticleRepository,
    },
  ],
})
export class ArticlesModule {}
