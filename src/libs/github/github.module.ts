import { Global, Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { GithubService } from './github.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.github.com',
    }),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
