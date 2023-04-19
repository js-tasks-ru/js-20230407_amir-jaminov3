/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    size = string.length;
  }

  if (size <= 0) {
    return '';
  }

  let result = '';
  let character = string[0];
  let counter = 0;

  for (const i in string) {
    if (counter < size || character !== string[i]) {
      if (character !== string[i]) {
        counter = 0;
        character = string[i];
      }

      result += string[i];
    }

    counter++;
  }

  return result;
}
