/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const composedObj = {...obj};

  for (let key in fields) {
    if (fields[key] in obj) {
      delete composedObj[fields[key]];
    }
  }

  return composedObj;
};
