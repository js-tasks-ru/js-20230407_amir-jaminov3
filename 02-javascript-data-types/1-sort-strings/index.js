/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort(function (a, b) {
    const sortOrder = a.toLowerCase().localeCompare(b.toUpperCase(), ['ru', 'en']);

    return param === 'asc' ? sortOrder : -sortOrder;
  });
}
