export interface IRepoParams {
  owner: string;
  repo: string;
}

export interface IGitHubPullsResponse {
  number: number;
  [key: string]: unknown;
}

export interface IGitHubPullRequestResponse {
  commits: number;
  id: number;
  number: number;
  title: string;
  user: IGitHubUser;
  [key: string]: unknown;
}

export interface IGitHubUser {
  login: string;
  [key: string]: unknown;
}
