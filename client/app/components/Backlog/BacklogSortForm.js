import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {filterBacklogStories} from '../../actions';

import {StyledBacklogSortForm, StyledSortDropdown, StyledSortDropdownItem} from './_styled';

/**
 * available sort options with their respective story comparators
 */
export const sortings = {
  newestFirst: {
    id: 'newest',
    labelKey: 'newest',
    comp: (sA, sB) => sB.createdAt - sA.createdAt
  },
  oldestFirst: {
    id: 'oldest',
    labelKey: 'oldest',
    comp: (sA, sB) => sA.createdAt - sB.createdAt
  },
  titleAsceding: {
    id: 'titleAZ',
    labelKey: 'titleAtoZ',
    comp: (sA, sB) => sA.title.localeCompare(sB.title)
  },
  titleDescending: {
    id: 'titleZA',
    labelKey: 'titleZtoA',
    comp: (sA, sB) => sB.title.localeCompare(sA.title)
  }
};

const BacklogSortForm = ({t, filterQuery, filterBacklogStories, sorting, onSortingChanged}) => {
  const dropdownRef = useRef(null);
  const [extended, setExtended] = useState(false);

  useOutsideClick(dropdownRef, () => setExtended(false));

  return (
    <StyledBacklogSortForm className="pure-form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={t('filter')}
        value={filterQuery}
        onChange={(e) => filterBacklogStories(e.target.value)}
      />
      <i
        onClick={() => setExtended(!extended)}
        className="clickable icon-exchange"
        title={t('sort')}
      ></i>

      {extended && (
        <StyledSortDropdown ref={dropdownRef}>
          {Object.values(sortings).map((sortingItem) => (
            <StyledSortDropdownItem
              selected={sortingItem.id === sorting.id}
              className="clickable"
              key={`sorting-item-${sortingItem.id}`}
              onClick={() => onSortingChanged(sortingItem)}
            >
              {t(sortingItem.labelKey)}
            </StyledSortDropdownItem>
          ))}
        </StyledSortDropdown>
      )}
    </StyledBacklogSortForm>
  );
};

BacklogSortForm.propTypes = {
  t: PropTypes.func.isRequired,
  filterBacklogStories: PropTypes.func.isRequired,
  sorting: PropTypes.object,
  filterQuery: PropTypes.string,
  onSortingChanged: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    filterQuery: state.backlogFilterQuery
  }),
  {filterBacklogStories}
)(BacklogSortForm);

const useOutsideClick = (ref, onOutside) => {
  useEffect(() => {
    function handleMousedownEvent(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handleMousedownEvent);
    return () => {
      document.removeEventListener('mousedown', handleMousedownEvent);
    };
  }, [ref]);
};
