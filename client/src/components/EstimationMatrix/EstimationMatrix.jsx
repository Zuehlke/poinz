import React, {useContext, useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {
  getActiveStoriesWithConsensus,
  getActiveStoriesWithoutConsensus,
  getAllStoriesWithConsensus,
  getAllStoriesWithoutConsensus
} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import {L10nContext} from '../../services/l10n';
import {toggleMatrixIncludeTrashed} from '../../state/actions/uiStateActions';
import {setStoryValue} from '../../state/actions/commandActions';
import EstimationMatrixColumn from './EstimationMatrixColumn';
import {getStoriesWithPendingSetValueCommand} from '../../state/commandTracking/commandTrackingSelectors';
import EstimationMatrixColumnUnestimated from './EstimationMatrixColumnUnestimated';
import {defaultSorting, matrixSortings} from '../common/storySortings';
import useOutsideClick from '../common/useOutsideClick';

import {
  StyledEMColumnsContainer,
  StyledEstimationMatrix,
  StyledMatrixHeader,
  StyledMatrixTools,
  StyledNoStoriesHint
} from './_styled';
import {StyledDropdown} from '../common/_styled';
import {StyledSortDropdownItem} from '../Backlog/_styled';

/**
 * Displays a table with all estimated stories (all stories with consensus), ordered by estimation value
 */
const EstimationMatrix = () => {
  const dispatch = useDispatch();
  const {t} = useContext(L10nContext);

  const includeTrashedStories = useSelector(state => state.ui.matrixIncludeTrashedStories);
  const unestimatedStories = useSelector(state => 
    includeTrashedStories ? getAllStoriesWithoutConsensus(state) : getActiveStoriesWithoutConsensus(state)
  );
  const estimatedStories = useSelector(state =>
    includeTrashedStories ? getAllStoriesWithConsensus(state) : getActiveStoriesWithConsensus(state)
  );
  const cardConfig = useSelector(getCardConfigInOrder);
  const pendingSetValueStories = useSelector(getStoriesWithPendingSetValueCommand);

  const columnWidth = getColWidth(cardConfig.length + 1);
  const [groupedStories, setGroupedStories] = useState({});
  const [sortedUnestimatedStories, setSortedUnestimatedStories] = useState(unestimatedStories);
  const [extendedSort, setExtendedSort] = useState(false);
  const [sorting, setSorting] = useState(defaultSorting);

  useEffect(() => {
    setGroupedStories(deriveGroupedStories(estimatedStories, pendingSetValueStories, sorting));
  }, [estimatedStories, pendingSetValueStories, sorting]);

  useEffect(() => {
    setSortedUnestimatedStories(unestimatedStories.sort(sorting.comp));
  }, [unestimatedStories, sorting, setSortedUnestimatedStories]);

  const sortDropdownRef = useRef(null);
  useOutsideClick(sortDropdownRef, () => setExtendedSort(false));

  const handleToggleMatrixIncludeTrashed = () => dispatch(toggleMatrixIncludeTrashed());
  const handleSetStoryValue = (storyId, value) => dispatch(setStoryValue(storyId, value));

  const onSortingOptionClicked = (sortingItem) => {
    setExtendedSort(false);
    setSorting(sortingItem);
  };

  return (
    <StyledEstimationMatrix data-testid="matrix">
      <StyledMatrixHeader>
        <h4>{t('matrix')}</h4>

        <StyledMatrixTools>
          <span onClick={handleToggleMatrixIncludeTrashed} className="clickable">
            <i className={includeTrashedStories ? 'icon-check' : 'icon-check-empty'}></i>{' '}
            {t('matrixIncludeTrashed')}
          </span>

          <div ref={sortDropdownRef}>
            <i
              onClick={() => setExtendedSort(!extendedSort)}
              className="clickable icon-exchange"
              title={t('sort')}
              data-testid="sortButton"
            />
            {extendedSort && (
              <StyledDropdown data-testid="sortOptions">
                {matrixSortings.map((sortingItem) => (
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
        </StyledMatrixTools>
      </StyledMatrixHeader>

      <StyledEMColumnsContainer>
        <EstimationMatrixColumnUnestimated
          key={'header:-unestimated'}
          columnWidth={columnWidth}
          stories={sortedUnestimatedStories}
        />

        {cardConfig.map((cc) => (
          <EstimationMatrixColumn
            onStoryDropped={handleSetStoryValue}
            key={'header:' + cc.value}
            columnWidth={columnWidth}
            cc={cc}
            stories={groupedStories[cc.value] || []}
          />
        ))}
      </StyledEMColumnsContainer>

      {Object.keys(groupedStories).length < 1 && (
        <StyledNoStoriesHint>
          <span>{t('noStoriesForMatrix')}</span>
        </StyledNoStoriesHint>
      )}
    </StyledEstimationMatrix>
  );
};

EstimationMatrix.propTypes = {
  unestimatedStories: PropTypes.array,
  estimatedStories: PropTypes.array,
  cardConfig: PropTypes.array,
  pendingSetValueStories: PropTypes.array,
  includeTrashedStories: PropTypes.bool,
  toggleMatrixIncludeTrashed: PropTypes.func.isRequired,
  setStoryValue: PropTypes.func.isRequired
};

export default EstimationMatrix;

const getColWidth = (cardConfigCount) => {
  const colWidthPercentage = 99 / cardConfigCount;
  return Math.round((colWidthPercentage + Number.EPSILON) * 100) / 100;
};

/**
 * group stories according to estimation value.
 *
 * @param estimatedStories
 * @param pendingSetValueStories
 * @param sorting
 * @return {object} Object that maps estimation value (consensus) to array of stories
 */
function deriveGroupedStories(estimatedStories, pendingSetValueStories, sorting) {
  // group by consensus
  const groupedStoriesUnsorted = estimatedStories.reduce((total, current) => {
    const isPending = pendingSetValueStories.find((ss) => ss.storyId === current.id);
    const consensus = isPending ? isPending.value : current.consensus;
    if (!total[consensus]) {
      total[consensus] = [];
    }
    total[consensus].push(current);
    return total;
  }, {});

  // now sort each story-array
  const groupedStoriesSorted = {};
  Object.entries(groupedStoriesUnsorted).forEach(
    ([consensus, stories]) => (groupedStoriesSorted[consensus] = stories.sort(sorting.comp))
  );

  return groupedStoriesSorted;
}
