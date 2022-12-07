import { Test } from '@nestjs/testing';
import { HttpModule, HttpService } from 'nestjs-http-promise';
import { GithubService } from './github.service';

describe('libs::github', () => {
  let httpService: HttpService;
  let service: GithubService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GithubService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('libs::github::GithubService', () => {
    // Happy Path Tests
    it.each([{ mock: [{ number: 1234 }] }, { mock: [] }])(
      'should fetch array of pulls from provided repo params',
      async ({ mock }) => {
        jest.spyOn(httpService, 'get').mockResolvedValue({ data: mock });

        const results = await service.fetchRepoPulls({
          owner: 'test',
          repo: 'test',
        });

        expect(results).toEqual(mock);
      },
    );

    it('should fetch data for a provided pull request', async () => {
      const mock = {
        commits: 4,
        id: 1,
        number: 1234,
        title: 'test',
        user: { login: 'test' },
      };

      jest.spyOn(httpService, 'get').mockResolvedValue({ data: mock });

      const results = await service.fetchPullRequest({
        owner: 'test',
        repo: 'test',
        number: 1234,
      });

      expect(results).toEqual(mock);
    });
  });
});
