import { Module } from '@nestjs/common';
import { GitHubModule } from '@/libs/github/github.module';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';

@Module({
  imports: [GitHubModule],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}
