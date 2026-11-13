import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class GetArticlesQuery {}

@QueryHandler(GetArticlesQuery)
export class GetArticlesHandler implements IQueryHandler<GetArticlesQuery> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(): Promise<Article[]> {
    return this.articleRepository.findAll();
  }
}
