import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import e from 'express';
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
    try {
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
   * @returns IGithubPullRequestResponse
   */
  async fetchPullRequest(
    params: { number: number } & IRepoParams,
  ): Promise<IGithubPullRequestResponse> {
    try {
      const { data } = await this.http.get(
        `repos/${params.owner}/${params.repo}/pulls/${params.number}`,
      );
      return data;
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  /**
   * Handles axios errors returned from Github API
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
    if (error.response.status === 422) {
      throw new UnauthorizedException(
        'Not authorized to view this repository',
        { description: error.message },
      );
    }

    if (error.response.status === 503) {
      throw new ServiceUnavailableException(
        'Github is unavailable at the moment',
        { description: error.message },
      );
    }

    throw new InternalServerErrorException(
      'Something unexpected has happened',
      { description: error.message },
    );
  }
}
