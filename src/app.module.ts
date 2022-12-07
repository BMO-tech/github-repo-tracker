import { Module } from '@nestjs/common';
import { V1Module } from './v1/v1.module';
import { LibsModule } from './libs/libs.module';

@Module({
  imports: [V1Module, LibsModule],
})
export class AppModule {}
