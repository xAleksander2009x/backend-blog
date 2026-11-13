import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../model/article.model';

export class ArticleResponse {
  @ApiProperty({
    description: 'Unique identifier of the article (UUID v4)',
    example: '5e1f0a2b-0001-4000-8000-000000000001',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the article',
    example: 'Getting Started with NestJS and Prisma 7',
  })
  title: string;

  @ApiProperty({
    description: 'Full text content of the article',
    example:
      'In this article, we explore how to structure a modern NestJS back-end application...',
  })
  content: string;

  @ApiProperty({
    description: 'Publication date in ISO 8601 format',
    example: '2026-08-01T10:00:00.000Z',
  })
  publishedAt: string;

  static fromModel(article: Article): ArticleResponse {
    const response = new ArticleResponse();
    response.id = article.id;
    response.title = article.title;
    response.content = article.content;
    response.publishedAt = article.publishedAt.toISOString();
    return response;
  }
}
