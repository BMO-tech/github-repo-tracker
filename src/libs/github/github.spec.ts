import {
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpModule, HttpService } from 'nestjs-http-promise';
import { GitHubService } from './github.service';

describe('libs::github', () => {
  let httpService: HttpService;
  let service: GitHubService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GitHubService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    service = module.get<GitHubService>(GitHubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('libs::github::GitHubService', () => {
    // Happy Path Tests
    it.each([{ mock: [{ number: 1234 }] }, { mock: [] }])(
      'should fetch array of pull requests from provided repo params',
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

    // Test errors
    it.each([401, 404, 422, 500, 503])(
      'should handle response status of %d',
      async (error: number) => {
        jest.spyOn(httpService, 'get').mockRejectedValue({
          response: { status: error },
          message: 'test',
        });

        try {
          await service.fetchRepoPulls({ owner: 'test', repo: 'test' });
          expect(true).toEqual(false); // Should never get here
        } catch (e) {
          if (error === 404) {
            expect(e).toBeInstanceOf(NotFoundException);
            return;
          }
          if (error === 401 || error === 422) {
            expect(e).toBeInstanceOf(UnauthorizedException);
            return;
          }
          if (error === 503) {
            expect(e).toBeInstanceOf(ServiceUnavailableException);
            return;
          }

          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      },
    );
  });
});
