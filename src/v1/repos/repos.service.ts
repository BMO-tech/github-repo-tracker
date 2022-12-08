import { Injectable } from '@nestjs/common';
import { GitHubService } from '@/libs/github/github.service';
import type { IGitHubPullsResponse, IRepoParams } from '@/libs/github/types';
import type { IPullRequestData } from './types';

@Injectable()
export class ReposService {
  constructor(private readonly github: GitHubService) {}

  /**
   * Gets pull requests from GitHub client library
   *
   * @param params Repository information
   *
   * @returns (IPullRequestData | {error:string})[]
   */
  async getPullRequests(
    params: IRepoParams,
    githubToken?: string,
  ): Promise<(IPullRequestData | { error: string })[]> {
    const pulls = await this.github.fetchRepoPulls(params, githubToken);

    return Promise.all(
      pulls.map(
        async (
          pull: IGitHubPullsResponse,
        ): Promise<IPullRequestData | { error: string }> => {
          try {
            const { id, number, title, user, commits } =
              await this.github.fetchPullRequest(
                {
                  number: pull.number,
                  ...params,
                },
                githubToken,
              );
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
