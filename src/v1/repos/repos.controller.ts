import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GitHubGuard, GitHubToken } from '@/libs/github/github.guard';
import { IRepoParams } from '@/libs/github/types';
import { ParseGitHubURL } from './pipes/parse-github-url.pipe';
import { PullRequestEntity } from './entities/pull-request.entity';
import { ReposService } from './repos.service';
import { IPullRequestData } from './types';

@ApiTags('Repositories')
@ApiBearerAuth()
@ApiNotFoundResponse({
  description:
    'The repository either could not be found or requires authentication',
})
@ApiUnauthorizedResponse({
  description: 'The requested repository requires proper authentication',
})
@ApiServiceUnavailableResponse({
  description: 'The API or GitHub is not currently available',
})
@UseGuards(GitHubGuard)
@Controller({ path: 'repos', version: '1' })
export class ReposController {
  private readonly logger = new Logger(ReposController.name);

  constructor(private readonly service: ReposService) {}

  /**
   * Gets pull request data for provided repository URL.
   */
  @ApiQuery({
    name: 'url',
    type: 'string',
    required: true,
    description: 'Repository URL',
  })
  @ApiOkResponse({
    description: 'Pull requests have been found',
    isArray: true,
    type: PullRequestEntity,
  })
  @ApiBadRequestResponse({
    description: 'The supplied repository url was invalid',
  })
  @Get('pull-requests')
  async getPullRequests(
    @GitHubToken() githubToken: string | null,
    @Query('url', ParseGitHubURL) params: IRepoParams,
  ): Promise<(IPullRequestData | { error: string })[]> {
    try {
      return await this.service.getPullRequests(params, githubToken);
    } catch (e) {
      this.logger.error(e, JSON.stringify(params));
      throw e;
    }
  }

  /**
   * Gets Pull Request data for provided owner and repo parameters.
   */
  @ApiOkResponse({
    description: 'Pull requests have been found',
    isArray: true,
    type: PullRequestEntity,
  })
  @ApiBadRequestResponse({
    description: 'The supplied owner and repo parameters were invalid',
  })
  @Get(':owner/:repo/pull-requests')
  async getPullRequestsByParams(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ): Promise<(IPullRequestData | { error: string })[]> {
    try {
      return await this.service.getPullRequests({ owner, repo });
    } catch (e) {
      this.logger.error(e, JSON.stringify({ owner, repo }));
      throw e;
    }
  }
}
