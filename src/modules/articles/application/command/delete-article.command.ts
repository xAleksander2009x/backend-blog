import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticleNotFoundException } from '../../model/article-not-found.exception';
import { ArticleRepository } from '../../model/article.repository';

export class DeleteArticleCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    const existing = await this.articleRepository.findById(command.id);
    if (!existing) {
      throw new ArticleNotFoundException(command.id);
    }
    await this.articleRepository.delete(command.id);
  }
}
