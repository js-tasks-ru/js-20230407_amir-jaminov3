/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const composedObj = {};

  for (let key in fields) {
    if (fields[key] in obj) {
      composedObj[fields[key]] = obj[fields[key]];
    }
  }

  return composedObj;
};
