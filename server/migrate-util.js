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

const toBulkOps = (opsArray, room) => {
  opsArray.push({
    replaceOne: {
      filter: {_id: room._id},
      replacement: room,
      upsert: false
    }
  });
};

module.exports = {
  indexById,
  toBulkOps
};
