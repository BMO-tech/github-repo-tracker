import { Module } from '@nestjs/common';
import { GitHubModule } from './github/github.module';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  imports: [GitHubModule, HelpersModule],
})
export class LibsModule {}
