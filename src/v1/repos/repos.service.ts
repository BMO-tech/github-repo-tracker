import { Injectable } from '@nestjs/common';
import { GithubService } from '@/libs/github/github.service';
import type { IGithubPullsResponse, IRepoParams } from '@/libs/github/types';
import type { IPullRequestData } from './types';

@Injectable()
export class ReposService {
  constructor(private readonly github: GithubService) {}

  /**
   * Gets pull requests from Github client library
   *
   * @param params Repository information
   *
   * @returns (IPullRequestData | {error:string})[]
   */
  async getPullRequests(
    params: IRepoParams,
  ): Promise<(IPullRequestData | { error: string })[]> {
    const pulls = await this.github.fetchRepoPulls(params);

    return Promise.all(
      pulls.map(
        async (
          pull: IGithubPullsResponse,
        ): Promise<IPullRequestData | { error: string }> => {
          try {
            const { id, number, title, user, commits } =
              await this.github.fetchPullRequest({
                number: pull.number,
                ...params,
              });
            return {
              id,
              number,
              title,
              author: user.login,
              commits,
            };
          } catch (e) {
            // TODO LOG THIS
            return { error: e.message };
          }
        },
      ),
    );
  }
}
