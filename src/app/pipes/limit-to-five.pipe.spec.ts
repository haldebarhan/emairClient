import { LimitToFivePipe } from './limit-to-five.pipe';

describe('LimitToFivePipe', () => {
  it('create an instance', () => {
    const pipe = new LimitToFivePipe();
    expect(pipe).toBeTruthy();
  });
});
