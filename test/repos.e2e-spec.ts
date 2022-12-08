import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { GitHubService } from '@/libs/github/github.service';

describe('ReposModule (e2e)', () => {
  const mockGitHubResponse = {
    commits: 4,
    id: 1,
    number: 1234,
    title: 'test',
    user: { login: 'test' },
  };

  let app: INestApplication;
  let github: GitHubService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    github = moduleFixture.get<GitHubService>(GitHubService);
    await app.init();
  });

  afterAll(async () => await app.close());

  describe('ReposController::success', () => {
    const mockSuccessValue = {
      commits: mockGitHubResponse.commits,
      id: mockGitHubResponse.id,
      number: mockGitHubResponse.number,
      title: mockGitHubResponse.title,
      author: mockGitHubResponse.user.login,
    };

    it('/GET repos/pull-requests', () => {
      jest
        .spyOn(github, 'fetchRepoPulls')
        .mockResolvedValue([{ number: 1234 }]);
      jest
        .spyOn(github, 'fetchPullRequest')
        .mockResolvedValue(mockGitHubResponse);

      return request(app.getHttpServer())
        .get('/repos/pull-requests')
        .query({ url: 'https://github.com/test/test' })
        .expect(200)
        .expect([mockSuccessValue]);
    });

    it('/GET repos/:owner/:repo/pull-requests', () => {
      jest
        .spyOn(github, 'fetchRepoPulls')
        .mockResolvedValue([{ number: 1234 }]);
      jest
        .spyOn(github, 'fetchPullRequest')
        .mockResolvedValue(mockGitHubResponse);

      return request(app.getHttpServer())
        .get('/repos/test/test/pull-requests')
        .expect(200)
        .expect([mockSuccessValue]);
    });
  });
});
