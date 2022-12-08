import { HelpersService } from './helpers.service';

describe('libs::helpers', () => {
  let service: HelpersService;

  beforeEach(() => {
    service = new HelpersService();
  });

  it('should sanitize a GitHub URL', () => {
    const result = service.sanitizeGitHubURL('https://github.com/test/test');
    expect(result).toEqual({ owner: 'test', repo: 'test' });
  });
});
