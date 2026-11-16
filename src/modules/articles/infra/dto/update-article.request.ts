import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateArticleRequest {
  @ApiPropertyOptional({
    description: 'Updated title of the article',
    minLength: 3,
    maxLength: 200,
    example: 'Updated Article Title',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated content of the article',
    minLength: 10,
    maxLength: 50000,
    example:
      'Updated full content of the blog post with at least ten characters.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(50000)
  content?: string;
}
