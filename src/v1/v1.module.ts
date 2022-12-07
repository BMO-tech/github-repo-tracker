import { Module } from '@nestjs/common';
import { ReposModule } from './repos/repos.module';

@Module({
  imports: [ReposModule]
})
export class V1Module {}
