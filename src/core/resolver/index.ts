import { flow } from 'lodash';
import { locatorResolver } from './locatorResolver';
import type { ResolverCreator } from '../type';

export function createResolver<T = any>(
  resolverCreator: ResolverCreator<T>[],
  data: T
) {
  const defaultResolverCreator = [locatorResolver];
  const resolvers = resolverCreator
    .concat(defaultResolverCreator)
    .map((creator) => {
      return creator(data);
    });
  return flow(resolvers);
}
