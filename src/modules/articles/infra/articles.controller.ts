import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/core/http/auth/admin.guard';
import { GenericBadRequestResponse } from 'src/core/http/response/bad-request.response';
import { ForbiddenResponse } from 'src/core/http/response/forbidden.response';
import { GenericNotFoundResponse } from 'src/core/http/response/not-found.response';
import { UnauthorizedResponse } from 'src/core/http/response/unauthorized.response';
import { UuidParam } from 'src/core/validation/decorator/uuid-v4-param.decorator';
import { CreateArticleCommand } from '../application/command/create-article.command';
import { DeleteArticleCommand } from '../application/command/delete-article.command';
import { UpdateArticleCommand } from '../application/command/update-article.command';
import { GetArticleByIdQuery } from '../application/query/get-article-by-id.query';
import { GetArticlesQuery } from '../application/query/get-articles.query';
import { Article } from '../model/article.model';
import { ArticleResponse } from './dto/article.response';
import { CreateArticleRequest } from './dto/create-article.request';
import { UpdateArticleRequest } from './dto/update-article.request';
@ApiTags('articles')
@Controller('/api/v1/articles')
export class ArticlesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Creates a new blog article (admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ArticleResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  async createArticle(
    @Body() body: CreateArticleRequest,
  ): Promise<ArticleResponse> {
    const article = await this.commandBus.execute<
      CreateArticleCommand,
      Article
    >(new CreateArticleCommand(body.title, body.content));
    return ArticleResponse.fromModel(article);
  }
  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Updates an existing blog article (admin only)' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async updateArticle(
    @UuidParam('id') id: string,
    @Body() body: UpdateArticleRequest,
  ): Promise<ArticleResponse> {
    const article = await this.commandBus.execute<
      UpdateArticleCommand,
      Article
    >(new UpdateArticleCommand(id, body.title, body.content));
    return ArticleResponse.fromModel(article);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deletes an existing blog article (admin only)' })
  @ApiParam({ name: 'id', example: '5e1f0a2b-0001-4000-8000-000000000001' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: GenericBadRequestResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ForbiddenResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: GenericNotFoundResponse })
  async deleteArticle(@UuidParam('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteArticleCommand, void>(
      new DeleteArticleCommand(id),
    );
  }
}
