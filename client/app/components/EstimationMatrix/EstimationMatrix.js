import React, {useContext, useState, useEffect} from 'react';
import {connect} from 'react-redux';
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

import {StyledEMColumnsContainer, StyledEstimationMatrix, StyledNoStoriesHint} from './_styled';
import {StyledStoryTitle} from '../_styled';
import {getStoriesWithPendingSetValueCommand} from '../../state/commandTracking/commandTrackingSelectors';

/**
 * Displays a table with all estimated stories (all stories with consensus), ordered by estimation value
 */
const EstimationMatrix = ({
  unestimatedStories,
  estimatedStories,
  cardConfig,
  pendingSetValueStories,
  includeTrashedStories,
  toggleMatrixIncludeTrashed,
  setStoryValue
}) => {
  const columnWidth = getColWidth(cardConfig.length + 1);
  const {t} = useContext(L10nContext);
  const [groupedStories, setGroupedStories] = useState({}); // grouped by consensus value

  useEffect(() => {
    setGroupedStories(deriveGroupedStories(estimatedStories, pendingSetValueStories));
  }, [estimatedStories, pendingSetValueStories]);

  return (
    <StyledEstimationMatrix data-testid="matrix">
      <StyledStoryTitle>
        {t('matrix')}
        <span onClick={toggleMatrixIncludeTrashed} className="clickable">
          <i className={includeTrashedStories ? 'icon-check' : 'icon-check-empty'}></i>{' '}
          {t('matrixIncludeTrashed')}
        </span>
      </StyledStoryTitle>

      <StyledEMColumnsContainer>
        <EstimationMatrixColumn
          key={'header:-unestimated'}
          columnWidth={columnWidth}
          cc={{color: '#cccccc', value: -200, label: '-'}}
          stories={unestimatedStories}
        />

        {cardConfig.map((cc) => (
          <EstimationMatrixColumn
            onStoryDropped={setStoryValue}
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

export default connect(
  (state) => ({
    unestimatedStories: state.ui.matrixIncludeTrashedStories
      ? getAllStoriesWithoutConsensus(state)
      : getActiveStoriesWithoutConsensus(state),
    estimatedStories: state.ui.matrixIncludeTrashedStories
      ? getAllStoriesWithConsensus(state)
      : getActiveStoriesWithConsensus(state),
    cardConfig: getCardConfigInOrder(state),
    includeTrashedStories: state.ui.matrixIncludeTrashedStories,
    pendingSetValueStories: getStoriesWithPendingSetValueCommand(state)
  }),
  {toggleMatrixIncludeTrashed, setStoryValue}
)(EstimationMatrix);

const getColWidth = (cardConfigCount) => {
  const colWidthPercentage = 99 / cardConfigCount;
  return Math.round((colWidthPercentage + Number.EPSILON) * 100) / 100;
};

/**
 * group stories according to estimation value.
 *
 * @param estimatedStories
 * @param pendingSetValueStories
 * @return {object} Object that maps estimation value (consensus) to array of stories
 */
function deriveGroupedStories(estimatedStories, pendingSetValueStories) {
  return estimatedStories.reduce((total, current) => {
    const isPending = pendingSetValueStories.find((ss) => ss.storyId === current.id);
    const consensus = isPending ? isPending.value : current.consensus;
    if (!total[consensus]) {
      total[consensus] = [];
    }
    total[consensus].push(current);
    return total;
  }, {});
}
