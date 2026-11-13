import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class GetArticleByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetArticleByIdQuery)
export class GetArticleByIdHandler implements IQueryHandler<GetArticleByIdQuery> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(query: GetArticleByIdQuery): Promise<Article> {
    const article = await this.articleRepository.findById(query.id);

    if (!article) {
      throw new NotFoundException(`Article with id "${query.id}" not found.`);
    }

    return article;
  }
}
