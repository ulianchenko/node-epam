import { Server } from 'http';
import { Socket } from 'net';
import { shutdown } from '../../bootstrap';

jest.mock('../../utils/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

describe('[Production-Ready Node.js Applications] Graceful shutdown', () => {
  let mockServer: Server;
  let mockConnections: Socket[];

  beforeEach(() => {
    mockServer = {
      close: jest.fn((callback) => callback && callback()),
      on: jest.fn(),
    } as unknown as Server;

    mockConnections = [
      { end: jest.fn(), destroy: jest.fn() } as unknown as Socket,
      { end: jest.fn(), destroy: jest.fn() } as unknown as Socket,
    ];

    jest.useFakeTimers();
    jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should close the server and exit with code 0 on successful shutdown', () => {
    shutdown(mockServer, mockConnections, 'SIGTERM');

    expect(mockServer.close).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  test('should forcefully exit with code 1 if the server does not close within the timeout', () => {
    shutdown(mockServer, mockConnections, 'SIGTERM');

    jest.advanceTimersByTime(20000);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('should end and destroy all active connections during shutdown', () => {
    shutdown(mockServer, mockConnections, 'SIGINT');

    mockConnections.forEach((connection) => {
      expect(connection.end).toHaveBeenCalled();
    });

    jest.advanceTimersByTime(10000);

    mockConnections.forEach((connection) => {
      expect(connection.destroy).toHaveBeenCalled();
    });
  });
});
