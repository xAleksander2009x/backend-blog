import { Article } from './article.model';

export abstract class ArticleRepository {
  abstract findAll(): Promise<Article[]>;
  abstract findById(id: string): Promise<Article | null>;
}
