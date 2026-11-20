import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../middlewares/request-logger';
import logger from '../../utils/logger';

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
}));

describe('[Production-Ready Node.js Applications] RequestLogger Middleware', () => {
  let request: Request;
  let response: Response;
  let nextFunction: NextFunction;

  beforeEach(() => {
    request = { method: 'GET', originalUrl: '/test' } as Request;

    response = {
      on: jest.fn((event, handler) => {
        if (event === 'finish') {
          handler();
        }
      }),
    } as unknown as Response;

    nextFunction = jest.fn();
  });

  it('should log the correct message on request completion', () => {
    requestLogger(request, response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringMatching(/^GET \/test - \d+ms$/));
  });
});
