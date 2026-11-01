import { exec } from 'child_process';

const timeout = 8000;

describe('[Module 4: Testing]', () => {
  it('NPM scripts are added to run tests', () => {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const packageJson = require('../../package.json');
    const scripts = Object.keys(packageJson.scripts);

    expect(scripts).toContain('test:unit');
    expect(scripts).toContain('test:integration');
    expect(scripts).toContain('test:e2e');
    expect(scripts).toContain('coverage');
  });

  it('Unit tests are written for public-holidays.service.ts and helpers.ts and run successfully', (done: jest.DoneCallback) => {
    exec('npm run test:unit', (error: Error | null, stdout: string, stderr: string) => {
      expect(error).toBeNull();
      expect(stderr).not.toContain('FAIL');
      expect(stderr).toContain('PASS');
      done();
    });
  }, timeout);

  it('Integration tests are written for public-holidays.service.ts and run successfully', (done: jest.DoneCallback) => {
    exec('npm run test:integration', (error: Error | null, stdout: string, stderr: string) => {
      expect(error).toBeNull();
      expect(stderr).not.toContain('FAIL');
      expect(stderr).toContain('PASS');
      done();
    });
  }, timeout);

  it('E2E tests are written for any two endpoints from Nager.Date API and run successfully', (done: jest.DoneCallback) => {
    exec('npm run test:e2e', (error: Error | null, stdout: string, stderr: string) => {
      expect(error).toBeNull();
      expect(stderr).not.toContain('FAIL');
      expect(stderr).toContain('PASS');

      const testSummary = stderr.match(/Tests:\s+(\d+) passed/);
      if (testSummary && testSummary[1]) {
        const totalTests = parseInt(testSummary[1], 10);
        expect(totalTests).toBeGreaterThan(1);
      }
      done();
    });
  }, timeout);
});
