import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyledBacklogSortForm, StyledSortDropdown, StyledSortDropdownItem} from './_styled';

export const sortings = {
  oldestFirst: {
    id: 'oldest',
    labelKey: 'oldest',
    comp: (sA, sB) => sA.createdAt - sB.createdAt
  },
  newestFirst: {
    id: 'newest',
    labelKey: 'newest',
    comp: (sA, sB) => sB.createdAt - sA.createdAt
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

const BacklogSortForm = ({t, sorting, onSortingChanged}) => {
  const dropdownRef = useRef(null);
  const [extended, setExtended] = useState(false);

  useOutsideClick(dropdownRef, () => setExtended(false));

  return (
    <StyledBacklogSortForm>
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
  sorting: PropTypes.object,
  onSortingChanged: PropTypes.func.isRequired
};

export default connect((state) => ({
  t: state.translator
}))(BacklogSortForm);
