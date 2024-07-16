import { LimitToEightPipe } from './limit-to-eight.pipe';

describe('LimitToEightPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitToEightPipe();
    expect(pipe).toBeTruthy();
  });
});
