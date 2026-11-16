import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticleRepository } from '../../model/article.repository';

export class DeleteArticleCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    const existing = await this.articleRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(`Article with id "${command.id}" not found.`);
    }
    await this.articleRepository.delete(command.id);
  }
}
