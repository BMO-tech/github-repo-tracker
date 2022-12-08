import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import {
  IGitHubPullRequestResponse,
  IGitHubPullsResponse,
  IRepoParams,
} from './types';

@Injectable()
export class GitHubService {
  constructor(private readonly http: HttpService) {}

  /**
   * Fetches an array of pulls for the provided repo
   *
   * @param params Repository information
   *
   * @returns IGitHubPullsResponse[]
   */
  async fetchRepoPulls(
    params: IRepoParams,
    githubToken?: string,
  ): Promise<IGitHubPullsResponse[]> {
    try {
      this.addAuthHeader(githubToken);
      const { data } = await this.http.get(
        `repos/${params.owner}/${params.repo}/pulls`,
      );
      return data;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  /**
   * Fetches pull request for the provided params
   *
   * @param params Pull Request information
   *
   * @returns IGitHubPullRequestResponse
   */
  async fetchPullRequest(
    params: { number: number } & IRepoParams,
    githubToken?: string,
  ): Promise<IGitHubPullRequestResponse> {
    try {
      this.addAuthHeader(githubToken);
      const { data } = await this.http.get(
        `repos/${params.owner}/${params.repo}/pulls/${params.number}`,
      );
      return data;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  /**
   * Adds authorization header if provided
   */
  private addAuthHeader(token?: string): void {
    if (!token) {
      return;
    }

    this.http.axiosRef.defaults.headers.common['Authorization'] = token;
  }

  /**
   * Handles axios errors returned from GitHub API
   *
   * @param error AxiosError
   */
  private handleAxiosError(error): void {
    if (error.response.status === 404) {
      throw new NotFoundException(
        'Repository was either not found or you do not have access',
        { description: error.message },
      );
    }
    if ([401, 422].includes(error.response.status)) {
      throw new UnauthorizedException(
        'Not authorized to view this repository',
        { description: error.message },
      );
    }

    if (error.response.status === 503) {
      throw new ServiceUnavailableException(
        'GitHub is unavailable at the moment',
        { description: error.message },
      );
    }

    throw new InternalServerErrorException(
      'Something unexpected has happened',
      { description: error.message },
    );
  }
}
