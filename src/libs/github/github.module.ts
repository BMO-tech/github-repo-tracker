import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { GitHubService } from './github.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.github.com',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
      validateStatus: (status) => status < 400,
    }),
  ],
  providers: [GitHubService],
  exports: [GitHubService],
})
export class GitHubModule {}
