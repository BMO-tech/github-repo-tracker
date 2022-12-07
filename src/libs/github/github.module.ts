import { Global, Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { GithubService } from './github.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.github.com',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
    }),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
