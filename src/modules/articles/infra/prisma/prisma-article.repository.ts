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
      (record) =>
        new Article(
          record.id,
          record.title,
          record.content,
          record.publishedAt,
        ),
    );
  }

  async findById(id: string): Promise<Article | null> {
    const record = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return new Article(
      record.id,
      record.title,
      record.content,
      record.publishedAt,
    );
  }
}
