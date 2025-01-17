import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import useOutsideClick from '../common/useOutsideClick';
import sortings from '../common/storySortings';
import {OpenFileDialogContext} from './BacklogFileDropWrapper';

import {StyledDropdown} from '../common/_styled';
import {StyledBacklogToolbar, StyledSortDropdownItem} from './_styled';

/**
 *  Toolbar that provides sort ("order by") dropdown menu as well as an input field for filtering and a "move all stories to trash" butotn.
 */
const BacklogToolbar = ({filterQuery, onQueryChanged, sorting, onSortingChanged, onTrashAll}) => {
  const {t} = useContext(L10nContext);

  const openFileDialog = useContext(OpenFileDialogContext);

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

      <div ref={sortDropdownRef}>
        <i
          onClick={() => setExtendedSort(!extendedSort)}
          className="clickable icon-exchange"
          title={t('sort')}
          data-testid="sortButton"
        />
        {extendedSort && (
          <StyledDropdown data-testid="sortOptions">
            {sortings.map((sortingItem) => (
              <StyledSortDropdownItem
                $selected={sortingItem.id === sorting.id}
                className="clickable"
                key={`sorting-item-${sortingItem.id}`}
                onClick={() => onSortingOptionClicked(sortingItem)}
              >
                {t(sortingItem.labelKey)}
              </StyledSortDropdownItem>
            ))}
          </StyledDropdown>
        )}
      </div>

      <div ref={moreDropdownRef}>
        <i
          onClick={() => setExtendedMore(!extendedMore)}
          className="clickable icon-ellipsis-vert"
          title={t('more')}
        />
        {extendedMore && (
          <StyledDropdown data-testid="moreOptions">
            <StyledSortDropdownItem className="clickable" onClick={() => openFileDialog()}>
              <i className="icon icon-upload-cloud"></i>
              {t('importFromFile')}
            </StyledSortDropdownItem>
            <StyledSortDropdownItem className="clickable" onClick={onTrashAll}>
              <i className="icon icon-trash"></i>
              {t('trashAllStories')}
            </StyledSortDropdownItem>
          </StyledDropdown>
        )}
      </div>
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
