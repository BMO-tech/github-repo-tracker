import { Injectable } from '@nestjs/common';
import { IRepoParams } from '@/libs/github/types';

@Injectable()
export class HelpersService {
  /**
   * Sanitizes a provide GitHub URL
   *
   * @param url GitHub URL to extract into an IRepoParams object
   *
   * @returns IRepo
   */
  sanitizeGitHubURL(url: string): IRepoParams {
    const { pathname } = new URL(url);
    const parts = pathname.split('/');
    return { owner: parts[1], repo: parts[2] };
  }
}
