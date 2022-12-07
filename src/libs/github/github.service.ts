import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import {
  IGithubPullRequestResponse,
  IGithubPullsResponse,
  IRepoParams,
} from './types';

@Injectable()
export class GithubService {
  constructor(private readonly http: HttpService) {}

  /**
   * Fetches an array of pulls for the provided repo
   *
   * @param params Repository information
   *
   * @returns IGithubPullsResponse[]
   */
  async fetchRepoPulls(params: IRepoParams): Promise<IGithubPullsResponse[]> {
    const { data } = await this.http.get(
      `repos/${params.owner}/${params.repo}/pulls`,
    );
    return data;
  }

  /**
   * Fetches pull request for the provided params
   *
   * @param params Pull Request information
   *
   * @returns IGithubPullRequestResponse
   */
  async fetchPullRequest(
    params: { number: number } & IRepoParams,
  ): Promise<IGithubPullRequestResponse> {
    const { data } = await this.http.get(
      `repos/${params.owner}/${params.repo}/pulls/${params.number}`,
    );
    return data;
  }
}
