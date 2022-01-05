import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';

import {StyledBacklogToolbar, StyledSortDropdownItem} from './_styled';
import {L10nContext} from '../../services/l10n';
import useOutsideClick from '../common/useOutsideClick';
import {StyledDropdown} from '../common/_styled';

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
  }
];
export const defaultSorting = sortings[0];

/**
 *  Toolbar that provides sort ("order by") dropdown menu as well as an input field for filtering and a "move all stories to trash" butotn.
 */
const BacklogToolbar = ({filterQuery, onQueryChanged, sorting, onSortingChanged, onTrashAll}) => {
  const {t} = useContext(L10nContext);
  const sortDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const [extendedSort, setExtendedSort] = useState(false);
  const [extendedMore, setExtendedMore] = useState(false);

  useOutsideClick(sortDropdownRef, () => setExtendedSort(false));
  useOutsideClick(moreDropdownRef, () => setExtendedMore(false));

  return (
    <StyledBacklogToolbar className="pure-form" onSubmit={(e) => e.preventDefault()}>
      <input
        data-testid="filterQueryInput"
        type="text"
        placeholder={t('filter')}
        value={filterQuery}
        autoComplete="new-password"
        onChange={(e) => onQueryChanged(e.target.value)}
      />
      <i
        onClick={() => setExtendedSort(!extendedSort)}
        className="clickable icon-exchange"
        title={t('sort')}
        data-testid="sortButton"
      />

      <i
        onClick={() => setExtendedMore(!extendedMore)}
        className="clickable icon-ellipsis-vert"
        title={t('more')}
      />

      {extendedSort && (
        <StyledDropdown ref={sortDropdownRef} data-testid="sortOptions">
          {sortings.map((sortingItem) => (
            <StyledSortDropdownItem
              selected={sortingItem.id === sorting.id}
              className="clickable"
              key={`sorting-item-${sortingItem.id}`}
              onClick={() => onSortingOptionClicked(sortingItem)}
            >
              {t(sortingItem.labelKey)}
            </StyledSortDropdownItem>
          ))}
        </StyledDropdown>
      )}

      {extendedMore && (
        <StyledDropdown ref={moreDropdownRef} data-testid="moreOptions">
          <StyledSortDropdownItem className="clickable" onClick={onTrashAll}>
            <i className="icon icon-trash"></i>
            {t('trashAllStories')}
          </StyledSortDropdownItem>
        </StyledDropdown>
      )}
    </StyledBacklogToolbar>
  );

  function onSortingOptionClicked(sortingItem) {
    setExtendedSort(false);
    onSortingChanged(sortingItem);
  }
};

BacklogToolbar.propTypes = {
  sorting: PropTypes.object,
  onSortingChanged: PropTypes.func.isRequired,
  onTrashAll: PropTypes.func.isRequired,
  filterQuery: PropTypes.string,
  onQueryChanged: PropTypes.func.isRequired
};

export default BacklogToolbar;
