import Configstore from 'configstore';
const packageJson = require('../../package.json');
const store = new Configstore(packageJson.name, { foo: 'bar' });

const originSet = store.set.bind(store);

store.set = function (key, value) {
  if (store.has(key)) {
    const existed = store.get(key);
    originSet(key, [...existed, value]);
  } else {
    originSet(key, [value]);
  }
} as typeof originSet;

export default store;
