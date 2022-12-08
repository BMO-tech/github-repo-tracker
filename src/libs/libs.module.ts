import { Module } from '@nestjs/common';
import { GithubModule } from './github/github.module';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  imports: [GithubModule, HelpersModule],
})
export class LibsModule {}
