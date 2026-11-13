import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/modules/articles/articles.module';
import { StatusController } from 'src/modules/status/status.controller';

@Module({
  imports: [ArticlesModule],
  controllers: [StatusController],
})
export class AppModule {}
