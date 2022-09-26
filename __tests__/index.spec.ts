import path from 'path';
import fs from 'fs-extra';
import { batchRender } from '../src';

const outDir = path.resolve(__dirname, 'result');

beforeEach(async () => {
  await fs.emptyDir(outDir);
});
describe('batchRender', () => {
  it('should defined', () => {
    expect(batchRender).toBeDefined();
  });
  it('handle dir placeholder', async () => {
    const templateDir = path.resolve(__dirname, 'template');
    const { output } = await batchRender({
      inputs: ['**/*'],
      cwd: templateDir,
      storeKey: 'dir',
      data: {
        name: 'webpage',
        type: 'embed',
      },
    });
    await output(outDir);
    const isExist = await fs.pathExists(
      path.join(outDir, 'webpage-embed/webpage.ts')
    );
    expect(isExist).toBe(true);
  });
});
