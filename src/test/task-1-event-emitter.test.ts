import { EventEmitter } from '../task-1-event-emitter';

describe('[Task 1] EventEmitter', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('should add and emit all event listeners', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    eventEmitter.on('testEvent', mockFn1);
    eventEmitter.on('testEvent', mockFn2);

    eventEmitter.emit('testEvent', 'testArg');

    expect(mockFn1).toHaveBeenCalledWith('testArg');
    expect(mockFn2).toHaveBeenCalledWith('testArg');
  });

  it('should return false when attempting to emit an event that has no listeners', () => {
    const result = eventEmitter.emit('nonExistentEvent', 'testArg');
    expect(result).toBe(false);
  });

  it('should remove event listeners', () => {
    const mockFn = jest.fn();
    eventEmitter.on('testEvent', mockFn);
    eventEmitter.off('testEvent', mockFn);

    eventEmitter.emit('testEvent', 'testArg');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not throw error if listener doesn\'t exist', () => {
    const mockFn = jest.fn();

    expect(() => {
      eventEmitter.removeListener('nonExistentEvent', mockFn);
    }).not.toThrow();
  });

  it('should emit event listeners only once when using once()', () => {
    const mockFn = jest.fn();
    eventEmitter.once('testEvent', mockFn);

    eventEmitter.emit('testEvent', 'testArg');
    eventEmitter.emit('testEvent', 'testArg');

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should return correct listener count', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    eventEmitter.on('testEvent', mockFn1);
    eventEmitter.on('testEvent', mockFn2);

    expect(eventEmitter.listenerCount('testEvent')).toBe(2);
  });

  it('should return 0 when getting the listener count for an event that has no listeners', () => {
    const count = eventEmitter.listenerCount('nonExistentEvent');
    expect(count).toBe(0);
  });

  it('should return correct raw listeners', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    eventEmitter.on('testEvent', mockFn1);
    eventEmitter.on('testEvent', mockFn2);

    expect(eventEmitter.rawListeners('testEvent')).toEqual([mockFn1, mockFn2]);

    eventEmitter.off('testEvent', mockFn2);
    expect(eventEmitter.rawListeners('testEvent')).toEqual([mockFn1]);
  });

  it('should return an empty array when getting the raw listeners for an event that has no listeners', () => {
    const rawListeners = eventEmitter.rawListeners('nonExistentEvent');
    expect(rawListeners).toEqual([]);
  });
});
