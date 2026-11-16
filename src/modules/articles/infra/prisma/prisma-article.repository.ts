import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Article } from '../../model/article.model';
import { ArticleRepository } from '../../model/article.repository';

@Injectable()
export class PrismaArticleRepository extends ArticleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Article[]> {
    const records = await this.prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
    return records.map(
      (r) => new Article(r.id, r.title, r.content, r.publishedAt),
    );
  }

  async findById(id: string): Promise<Article | null> {
    const r = await this.prisma.article.findUnique({ where: { id } });
    return r ? new Article(r.id, r.title, r.content, r.publishedAt) : null;
  }

  async create(article: Article): Promise<Article> {
    const r = await this.prisma.article.create({
      data: {
        id: article.id,
        title: article.title,
        content: article.content,
        publishedAt: article.publishedAt,
      },
    });
    return new Article(r.id, r.title, r.content, r.publishedAt);
  }

  async update(article: Article): Promise<Article> {
    const r = await this.prisma.article.update({
      where: { id: article.id },
      data: { title: article.title, content: article.content },
    });
    return new Article(r.id, r.title, r.content, r.publishedAt);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({ where: { id } });
  }
}
