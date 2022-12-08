import { IPullRequestData } from '../types';

/**
 * @note I don't like that this need to be created just for the Swagger docs
 */
export class PullRequestEntity implements IPullRequestData {
  author: string;
  commits: number;
  id: number;
  number: number;
  title: string;
}
