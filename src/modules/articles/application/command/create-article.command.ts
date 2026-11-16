import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class CreateArticleCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
  ) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: CreateArticleCommand): Promise<Article> {
    const article = new Article(
      randomUUID(),
      command.title,
      command.content,
      new Date(),
    );
    return this.articleRepository.create(article);
  }
}
