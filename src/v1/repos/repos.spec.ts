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
      { url: 'https://github.com/test/test' },
    ])(
      'should handle a GET request to fetch pull request data',
      async ({ params }) => {
        const mockResult = {
          commits: 4,
          id: 1,
          number: 1234,
          title: 'test',
          user: { login: 'test' },
        };

        jest.spyOn(service, 'getPullRequests').mockResolvedValue([mockResult]);

        const results = await controller.getPullRequests(params);

        expect(results).toEqual([mockResult]);
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
      const mockResult = {
        commits: 4,
        id: 1,
        number: 1234,
        title: 'test',
        user: { login: 'test' },
      };

      jest
        .spyOn(github, 'fetchRepoPulls')
        .mockResolvedValue([{ number: 1234 }]);

      jest.spyOn(github, 'fetchPullRequest').mockResolvedValue(mockResult);

      const results = await service.getPullRequests({
        owner: 'test',
        repo: 'test',
      });

      expect(results).toEqual([mockResult]);
    });
  });
});
