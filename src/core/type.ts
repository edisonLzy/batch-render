export enum FileType {
  FILE,
  Directory,
}
export interface FileResult {
  type: FileType.FILE;
  outPath: string;
  content: string;
}
export interface DirectoryResult {
  type: FileType.Directory;
  outPath: string;
}
export type Result = DirectoryResult | FileResult;
export type RenderStrategy<T> = (template: string, data: T) => string;
export interface BatchRenderOption<T> {
  inputs: string | string[];
  data: T;
  storeKey: string;
  renderStrategy?: RenderStrategy<T>;
  cwd?: string;
}

export interface MatchResult {
  path: string;
  name: string;
}
