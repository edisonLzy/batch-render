import { createResolver } from '../src/core/resolver';

describe('batchRender', () => {
  it('locatorResolver', () => {
    const input = '[name]-[type]';
    const data = {
      name: 'video',
      type: 'embed',
    };
    const resolver = createResolver(
      [
        (data) => {
          return (raw) => {
            return '[name]-[name]';
          };
        },
      ],
      data
    );
    expect(resolver(input, data)).toBe('video-video');
  });
});
