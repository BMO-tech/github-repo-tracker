import { Injectable } from '@nestjs/common';
import { IRepoParams } from '@/libs/github/types';

@Injectable()
export class HelpersService {
  /**
   * Sanitizes a provide Github URL
   *
   * @param url Github URL to extract into an IRepoParams object
   *
   * @returns IRepo
   */
  sanitizeGithubURL(url: string): IRepoParams {
    const { pathname } = new URL(url);
    const parts = pathname.split('/');
    return { owner: parts[1], repo: parts[2] };
  }
}
