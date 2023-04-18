/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort(function (a, b) {
    let sortOrder;

    if (a[0].match(/[a-z]/i) && !b[0].match(/[a-z]/i)) {
      sortOrder = 1;
    } else if (!a[0].match(/[a-z]/i) && b[0].match(/[a-z]/i)) {
      sortOrder = -1;
    } else {
      sortOrder = a.toLowerCase().localeCompare(b.toUpperCase());
    }

    return param === 'asc' ? sortOrder : -sortOrder;
  });
}
