function cloneDeep<T extends object = object>(obj: T): T {
  return (function _cloneDeep<V>(item: V): V {
    if (item === null || typeof item !== 'object') {
      return item;
    }

    if (item instanceof Date) {
      return new Date(item.valueOf()) as V;
    }

    if (item instanceof Array) {
      const copy: unknown[] = [];

      item.forEach((_, i) => (copy[i] = _cloneDeep(item[i])));

      return copy as V;
    }

    if (item instanceof Set) {
      const copy = new Set();

      item.forEach((v) => copy.add(_cloneDeep(v)));

      return copy as V;
    }

    if (item instanceof Map) {
      const copy = new Map();

      item.forEach((v, k) => copy.set(k, _cloneDeep(v)));

      return copy as V;
    }

    if (item instanceof Object) {
      const copy: Record<string | symbol, unknown> = {};
      const objectItem = item as Record<string | symbol, unknown>;

      Object.getOwnPropertySymbols(item).forEach((s) => (copy[s] = _cloneDeep(objectItem[s])));

      Object.keys(item).forEach((k) => (copy[k] = _cloneDeep(objectItem[k])));

      return copy as V;
    }

    throw new Error(`Unable to copy object: ${item}`);
  }(obj));
}

export default cloneDeep;
