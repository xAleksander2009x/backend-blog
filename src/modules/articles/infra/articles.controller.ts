import { Controller, Get, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericBadRequestResponse } from 'src/core/http/response/bad-request.response';
import { GenericNotFoundResponse } from 'src/core/http/response/not-found.response';
import { UuidParam } from 'src/core/validation/decorator/uuid-v4-param.decorator';
import { GetArticleByIdQuery } from '../application/query/get-article-by-id.query';
import { GetArticlesQuery } from '../application/query/get-articles.query';
import { Article } from '../model/article.model';
import { ArticleResponse } from './dto/article.response';

@ApiTags('articles')
@Controller('/api/v1/articles')
export class ArticlesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Returns all published articles, newest first' })
  @ApiResponse({ status: HttpStatus.OK, type: [ArticleResponse] })
  async getArticles(): Promise<ArticleResponse[]> {
    const articles = await this.queryBus.execute<GetArticlesQuery, Article[]>(
      new GetArticlesQuery(),
    );
    return articles.map(ArticleResponse.fromModel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a single article by its UUID' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async getArticleById(@UuidParam('id') id: string): Promise<ArticleResponse> {
    const article = await this.queryBus.execute<GetArticleByIdQuery, Article>(
      new GetArticleByIdQuery(id),
    );
    return ArticleResponse.fromModel(article);
  }
}
