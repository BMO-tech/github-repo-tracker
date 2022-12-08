import { IPullRequestData } from './types';

export class RepoEntity implements IPullRequestData {
  author: string;
  commit_count: number;
  id: number;
  number: number;
  title: string;
}
