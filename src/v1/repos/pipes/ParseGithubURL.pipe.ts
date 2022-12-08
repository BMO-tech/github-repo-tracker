import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { HelpersService } from '@/libs/helpers/helpers.service';
import { IRepoParams } from '@/libs/github/types';

@Injectable()
export class ParseGithubURL implements PipeTransform {
  constructor(private readonly helper: HelpersService) {}

  transform(value: any): IRepoParams {
    if (!value || value === undefined) {
      throw new BadRequestException('No Github URL was provided');
    }
    return this.helper.sanitizeGithubURL(value);
  }
}
