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
      providers: [GithubService, HttpService],
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
        jest.spyOn(httpService, 'get').mockResolvedValue(mock);
        const stub = { owner: 'test', repo: 'test' };
        const results = await service.fetchRepoPulls(stub);

        expect(results).toEqual(mock);
      },
    );
  });
});
