import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ArticleNotFoundException } from '../../model/article-not-found.exception';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class GetArticleByIdQuery extends Query<Article> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetArticleByIdQuery)
export class GetArticleByIdHandler implements IQueryHandler<GetArticleByIdQuery> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(query: GetArticleByIdQuery): Promise<Article> {
    const article = await this.articleRepository.findById(query.id);
    if (!article) {
      throw new ArticleNotFoundException(query.id);
    }
    return article;
  }
}
