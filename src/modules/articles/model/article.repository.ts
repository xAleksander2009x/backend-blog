import { Article } from './article.model';

export abstract class ArticleRepository {
  abstract findAll(): Promise<Article[]>;
  abstract findById(id: string): Promise<Article | null>;
  abstract create(article: Article): Promise<Article>;
  abstract update(article: Article): Promise<Article>;
  abstract delete(id: string): Promise<void>;
}
