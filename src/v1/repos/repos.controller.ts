import { IRepoParams } from '@/libs/github/types';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ParseGithubURL } from './pipes/ParseGithubURL.pipe';
import { RepoEntity } from './repo.entity';
import { ReposService } from './repos.service';
import { IPullRequestData } from './types';

@ApiTags('Repositories')
@ApiNotFoundResponse({
  description:
    'The repository either could not be found or requires authentication',
})
@ApiUnauthorizedResponse({
  description: 'The requested repository requires proper authentication',
})
@ApiServiceUnavailableResponse({
  description: 'The API or Github is not currently available',
})
@Controller({ path: 'repos', version: '1' })
export class ReposController {
  constructor(private readonly service: ReposService) {}

  @ApiOperation({
    summary: 'Get Pull Request data for provided repository URL',
  })
  @ApiQuery({
    name: 'url',
    type: 'string',
    required: true,
    description: 'Repository URL',
  })
  @ApiOkResponse({
    description: 'Pull requests have been found',
    isArray: true,
    type: RepoEntity,
  })
  @ApiBadRequestResponse({
    description: 'The supplied repository url was invalid',
  })
  @Get('pull-requests')
  async getPullRequests(
    @Query('url', ParseGithubURL) params: IRepoParams,
  ): Promise<(IPullRequestData | { error: string })[]> {
    try {
      return await this.service.getPullRequests(params);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Get Pull Request data for provided owner and repo parameters',
  })
  @ApiOkResponse({
    description: 'Pull requests have been found',
    isArray: true,
    type: RepoEntity,
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
      console.error(e);
      throw e;
    }
  }
}
