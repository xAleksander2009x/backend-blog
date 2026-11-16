import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticleNotFoundException } from '../../model/article-not-found.exception';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class UpdateArticleCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly content?: string,
  ) {
    super();
  }
}

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: UpdateArticleCommand): Promise<void> {
    const existing = await this.articleRepository.findById(command.id);
    if (!existing) {
      throw new ArticleNotFoundException(command.id);
    }
    const updated = new Article(
      existing.id,
      command.title ?? existing.title,
      command.content ?? existing.content,
      existing.publishedAt,
    );
    await this.articleRepository.update(updated);
  }
}
