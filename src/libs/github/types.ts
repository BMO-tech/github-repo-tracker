export interface IRepoParams {
  owner: string;
  repo: string;
}

export interface IGithubPullsResponse {
  number: number;
  [key: string]: unknown;
}

export interface IGithubPullRequestResponse {
  commits: number;
  id: number;
  number: number;
  user: IGithubUser;
  [key: string]: unknown;
}

export interface IGithubUser {
  login: string;
  [key: string]: unknown;
}
