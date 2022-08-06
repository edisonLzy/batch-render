import fs from 'fs-extra';
import fg, { Entry } from 'fast-glob';
import pMap from 'p-map';
import { template } from 'lodash';
import log from './log';

import { BatchRenderOption, FileType, RenderStrategy, Result } from './type';
import path from 'path';
import store from './store';

const defaultSenderStrategy: RenderStrategy<any> = (content, data) => {
  const compile = template(content);
  return compile(data);
};
export default async function batchRender<T = any>({
  inputs,
  data,
  storeKey,
  cwd = process.cwd(),
  renderStrategy = defaultSenderStrategy,
}: BatchRenderOption<T>) {
  let patterns = inputs;
  if (typeof inputs === 'string') {
    patterns = [inputs];
  }

  const matchEntries = await fg(inputs, {
    cwd,
    onlyFiles: false,
    objectMode: true,
    stats: true,
  });

  const manifest = await pMap<Entry, Result>(matchEntries, async (entry) => {
    if (entry.dirent.isFile()) {
      const filePath = path.join(cwd, entry.path);
      const template = (await fs.readFile(filePath)).toString();
      const content = renderStrategy(template, data);
      return {
        type: FileType.FILE,
        outPath: entry.path,
        content: content,
      };
    } else {
      return {
        type: FileType.Directory,
        outPath: entry.path,
      };
    }
  });

  return {
    manifest,
    output: async (outDir: string) => {
      const resolveOutDir = (p: string) => {
        return path.resolve(outDir, p);
      };
      // 创建目标目录
      await fs.mkdirp(outDir);
      store.set(storeKey, outDir);
      log('Created %s', outDir);
      // 处理manifest
      for (const item of manifest) {
        const outPath = resolveOutDir(item.outPath);
        // cache path in store
        store.set(storeKey, outPath);
        if (item.type === FileType.FILE) {
          await fs.writeFile(outPath, item.content);
        } else {
          await fs.mkdirp(outPath);
        }
        log('Created %s', outPath);
      }
    },
  };
}

export async function clearRenderFiles(key: string) {
  if (!store.has(key)) {
    const keys = Object.keys(store.all);
    log('The %s does not exited in store, the exited keys is %O', key, keys);
    return;
  }
  const storeFiles = store.get(key);
  await Promise.all(
    storeFiles.map((file: string) => {
      return fs.rm(file, {
        recursive: true,
      });
    })
  );
  log('Cleared %s', key);
}
