import { Controller, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';
import { IPullRequestData } from './types';

@Controller({ path: 'repos', version: '1' })
export class ReposController {
  constructor(private readonly service: ReposService) {}

  @Get()
  async getPullRequests(
    @Query() params: { owner?: string; repo?: string; url?: string },
  ): Promise<IPullRequestData[]> {
    try {
      if (Object.values(params).length === 0) {
        throw new Error('Either supply owner and repo values or the repo URL');
      }
      if ((params.owner && !params.repo) || (params.repo && !params.owner)) {
        throw new Error('Either Owner and Repo must be provided');
      }

      // If a URL is provided then ignore provided owner and repo
      const repoParams = params.url
        ? this.service.sanitizeUrl(params.url)
        : { owner: params.owner, repo: params.repo };

      return await this.service.getPullRequests(repoParams);
    } catch (e) {
      console.error(e);
    }
  }
}
