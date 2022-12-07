import { Module } from '@nestjs/common';
import { GithubModule } from '@/libs/github/github.module';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';

@Module({
  imports: [GithubModule],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}
