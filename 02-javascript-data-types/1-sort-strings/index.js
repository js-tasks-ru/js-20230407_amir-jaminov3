/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr].sort(function (a, b) {
    if (a[0].match(/[a-z]/i) && !b[0].match(/[a-z]/i)) {
      return 1;
    } else if (!a[0].match(/[a-z]/i) && b[0].match(/[a-z]/i)) {
      return -1;
    }

    return a.toLowerCase().localeCompare(b.toUpperCase());
  });

  if (param === 'asc') {
    return sortedArr;
  }

  return sortedArr.reverse();
}
