import { GithubModule } from '@/libs/github/github.module';
import { GithubService } from '@/libs/github/github.service';
import { HelpersService } from '@/libs/helpers/helpers.service';
import { ContextIdFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';

describe('v1::repos', () => {
  let controller: ReposController;
  let github: GithubService;
  let service: ReposService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [GithubModule],
      controllers: [ReposController],
      providers: [HelpersService, ReposService],
    }).compile();

    controller = module.get<ReposController>(ReposController);
    github = module.get<GithubService>(GithubService);
    service = module.get<ReposService>(ReposService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('v1::repos::ReposService', () => {
    // Happy Path Tests
    it('should get pull requests from github client library', async () => {
      const mock = {
        commits: 4,
        id: 1,
        number: 1234,
        title: 'test',
        user: { login: 'test' },
      };

      jest
        .spyOn(github, 'fetchRepoPulls')
        .mockResolvedValue([{ number: 1234 }]);

      jest.spyOn(github, 'fetchPullRequest').mockResolvedValue(mock);

      const results = await service.getPullRequests({
        owner: 'test',
        repo: 'test',
      });

      expect(results).toEqual([
        {
          id: mock.id,
          number: mock.number,
          title: mock.title,
          author: mock.user.login,
          commits: mock.commits,
        },
      ]);
    });

    // Error Handling
    it('should capture an error in the resulting pull request data', async () => {
      const mock = {
        commits: 4,
        id: 1,
        number: 1234,
        title: 'test',
        user: { login: 'test' },
      };

      jest
        .spyOn(github, 'fetchRepoPulls')
        .mockResolvedValue([
          { number: 1234 },
          { number: 1234 },
          { number: 1234 },
        ]);

      jest
        .spyOn(github, 'fetchPullRequest')
        .mockResolvedValueOnce(mock)
        .mockRejectedValueOnce(new Error('test'))
        .mockResolvedValueOnce(mock);

      const results = await service.getPullRequests({
        owner: 'test',
        repo: 'test',
      });

      const resultMock = {
        id: mock.id,
        number: mock.number,
        title: mock.title,
        author: mock.user.login,
        commits: mock.commits,
      };

      expect(results).toEqual([resultMock, { error: 'test' }, resultMock]);
    });
  });
});
