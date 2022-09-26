import { ResolverCreator } from '../type';
const reg = /\[(.+?)\]/g;
export const locatorResolver: ResolverCreator = (data) => {
  return (raw) => {
    const match = raw.matchAll(reg);
    if (!match) return raw;
    return [...match].reduce((acc, cur) => {
      const [matchRaw, matchKey] = cur;
      return acc.replace(matchRaw, data[matchKey]);
    }, raw);
  };
};
