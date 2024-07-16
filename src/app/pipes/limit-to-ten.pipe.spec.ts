import { LimitToTenPipe } from './limit-to-ten.pipe';

describe('LimitToTenPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitToTenPipe();
    expect(pipe).toBeTruthy();
  });
});
