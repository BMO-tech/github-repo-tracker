import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class GithubGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;

    if (!authorization) {
      return true;
    }

    request.githubToken = authorization;
    return true;
  }
}

export const GithubToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.githubToken ?? null;
  },
);
