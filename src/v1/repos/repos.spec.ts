import { GithubModule } from '@/libs/github/github.module';
import { GithubService } from '@/libs/github/github.service';
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
      providers: [ReposService],
    }).compile();

    controller = module.get<ReposController>(ReposController);
    github = module.get<GithubService>(GithubService);
    service = module.get<ReposService>(ReposService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('v1::repos::ReposController', () => {
    // Happy Path Tests
    it.each([
      { params: { owner: 'test', repo: 'test' } },
      { params: { url: 'https://github.com/test/test' } },
    ])(
      'should handle a GET request to fetch pull request data',
      async ({ params }) => {
        const mock = {
          commit_count: 4,
          id: 1,
          number: 1234,
          title: 'test',
          author: 'test',
        };

        jest.spyOn(service, 'getPullRequests').mockResolvedValue([mock]);

        const results = await controller.getPullRequests(params);

        expect(results).toEqual([mock]);
      },
    );
  });

  describe('v1::repos::ReposService', () => {
    // Happy Path Tests
    it('should extract owner and repo from url', () => {
      const results = service.sanitizeUrl('https://github.com/test/test');

      expect(results).toEqual({ owner: 'test', repo: 'test' });
    });

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
          commit_count: mock.commits,
        },
      ]);
    });
  });
});
