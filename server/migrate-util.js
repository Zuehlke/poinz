/**
 *
 * @param {object[]} arr
 * @return {object}
 */
const indexById = (arr) =>
  Array.isArray(arr)
    ? arr.reduce((total, currItem) => {
        if (!currItem.id) {
          throw new Error('cannot index by id!');
        }
        total[currItem.id] = currItem;
        return total;
      }, {})
    : {};

module.exports = {
  indexById
};
