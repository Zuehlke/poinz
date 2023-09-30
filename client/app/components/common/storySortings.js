/**
 * available sort options with their respective story comparators
 */
const sortings = [
  {
    id: 'newest',
    labelKey: 'newest',
    comp: (sA, sB) => sB.createdAt - sA.createdAt
  },
  {
    id: 'oldest',
    labelKey: 'oldest',
    comp: (sA, sB) => sA.createdAt - sB.createdAt
  },
  {
    id: 'titleAZ',
    labelKey: 'titleAtoZ',
    comp: (sA, sB) => sA.title.localeCompare(sB.title)
  },
  {
    id: 'titleZA',
    labelKey: 'titleZtoA',
    comp: (sA, sB) => sB.title.localeCompare(sA.title)
  },
  {
    id: 'withConsensus',
    labelKey: 'withConsensusFirst',
    comp: (sA, sB) => {
      if (sA.consensus && !sB.consensus) {
        return -1;
      } else if (sB.consensus && !sA.consensus) {
        return 1;
      } else {
        return sortings[0].comp(sA, sB); // use default sorting, if no difference in consensus
      }
    }
  },
  {
    id: 'withoutConsensus',
    labelKey: 'withoutConsensusFirst',
    comp: (sA, sB) => {
      if (sA.consensus && !sB.consensus) {
        return 1;
      } else if (sB.consensus && !sA.consensus) {
        return -1;
      } else {
        return sB.createdAt - sA.createdAt;
      }
    }
  },
  {
    id: 'manual',
    labelKey: 'manual',
    comp: (sA, sB) => {
      // if a story has no manual "sortOrder" set, move it to the end of the list
      // a low sortOrder value means "first" / "top" of the list.
      if (isSortOrderDefined(sA) && !isSortOrderDefined(sB)) {
        return -1;
      } else if (!isSortOrderDefined(sA) && isSortOrderDefined(sB)) {
        return 1;
      } else if (!isSortOrderDefined(sA) && !isSortOrderDefined(sB)) {
        return defaultSorting.comp(sA, sB);
      } else {
        return sA.sortOrder - sB.sortOrder;
      }
    }
  }
];

const isSortOrderDefined = (story) => story.sortOrder !== undefined && story.sortOrder !== null;

export default sortings;

export const defaultSorting = sortings[0];

export const manualSorting = sortings[6];

export const matrixSortings = sortings.slice(0, 4); // in the estimation matrix, we want to provide only a reduced set of sorting options
