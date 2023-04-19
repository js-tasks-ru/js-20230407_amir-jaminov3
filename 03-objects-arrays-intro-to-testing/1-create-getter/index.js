/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    let prop = obj;

    for (const field of path.split('.')) {
      if (!Object.keys(prop).includes(field)) {
        return undefined;
      }

      prop = prop[field];
    }

    return prop;
  };
}
