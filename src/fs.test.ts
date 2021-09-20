import { FS } from './fs';

describe('fs', () => {
  describe('new', () => {
    it('should create an instance with relative path', () => {
      const fs = new FS({ base: './' });
      expect(fs.base).toMatch(/\/repo-linter\/$/);
    });

    it('should create an instance with no path', () => {
      const fs = new FS({});
      expect(fs.base).toMatch(/\/repo-linter\/$/);
    });

    it('should create an instance with absolute path', () => {
      const fs = new FS({ base: '/Users/foo/bar' });
      expect(fs.base).toEqual('/Users/foo/bar');
    });
  });

  describe('toBase', () => {
    it('should remove base', () => {
      const fs = new FS({ base: './' });
      expect(fs.toBase('./foo/bar')).toEqual('foo/bar');
    });
  });
});
