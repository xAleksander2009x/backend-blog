import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

export class UpdateArticleCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly content?: string,
  ) {}
}

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: UpdateArticleCommand): Promise<Article> {
    const existing = await this.articleRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(`Article with id "${command.id}" not found.`);
    }
    const updated = new Article(
      existing.id,
      command.title ?? existing.title,
      command.content ?? existing.content,
      existing.publishedAt,
    );
    return this.articleRepository.update(updated);
  }
}
