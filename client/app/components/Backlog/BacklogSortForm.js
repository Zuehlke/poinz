import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';

import {StyledBacklogSortForm, StyledSortDropdownItem} from './_styled';
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
 *  SortForm that provides sort ("order by") dropdown menu as well as an input field for filtering
 */
const BacklogSortForm = ({filterQuery, onQueryChanged, sorting, onSortingChanged}) => {
  const {t} = useContext(L10nContext);
  const dropdownRef = useRef(null);
  const [extended, setExtended] = useState(false);

  useOutsideClick(dropdownRef, () => setExtended(false));

  return (
    <StyledBacklogSortForm className="pure-form" onSubmit={(e) => e.preventDefault()}>
      <input
        data-testid="filterQueryInput"
        type="text"
        placeholder={t('filter')}
        value={filterQuery}
        autoComplete="off"
        onChange={(e) => onQueryChanged(e.target.value)}
      />
      <i
        onClick={() => setExtended(!extended)}
        className="clickable icon-exchange"
        title={t('sort')}
        data-testid="sortButton"
      />

      {extended && (
        <StyledDropdown ref={dropdownRef} data-testid="sortOptions">
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
    </StyledBacklogSortForm>
  );

  function onSortingOptionClicked(sortingItem) {
    setExtended(false);
    onSortingChanged(sortingItem);
  }
};

BacklogSortForm.propTypes = {
  sorting: PropTypes.object,
  onSortingChanged: PropTypes.func.isRequired,
  filterQuery: PropTypes.string,
  onQueryChanged: PropTypes.func.isRequired
};

export default BacklogSortForm;
