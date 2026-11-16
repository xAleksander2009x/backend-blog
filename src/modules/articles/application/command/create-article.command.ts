import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class CreateArticleCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
  ) {
    super();
  }
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: CreateArticleCommand): Promise<void> {
    const article = new Article(
      command.id,
      command.title,
      command.content,
      new Date(),
    );
    await this.articleRepository.create(article);
  }
}
