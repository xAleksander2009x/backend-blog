import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleRequest {
  @ApiProperty({
    description: 'Title of the article',
    minLength: 3,
    maxLength: 200,
    example: 'Building Secure REST APIs with NestJS',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Full content of the article',
    minLength: 10,
    maxLength: 50000,
    example:
      'In this guide we walk through guards, validation pipes, and CQRS commands.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(50000)
  content: string;
}
