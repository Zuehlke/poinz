import React, {useContext, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {getAllStoriesWithConsensus} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import {L10nContext} from '../../services/l10n';
import {toggleMatrixIncludeTrashed} from '../../state/actions/uiStateActions';
import {settleEstimation} from '../../state/actions/commandActions';
import EstimationMatrixColumn from './EstimationMatrixColumn';

import {StyledEMColumnsContainer, StyledEstimationMatrix, StyledNoStoriesHint} from './_styled';
import {StyledStoryTitle} from '../_styled';
import {getSettlingStories} from '../../state/commandTracking/commandTrackingSelectors';

export const ItemTypes = {
  STORY: 'story'
};

/**
 * Displays a table with all estimated stories (all stories with consensus), ordered by estimation value
 */
const EstimationMatrix = ({
  estimatedStories,
  cardConfig,
  settlingStories,
  includeTrashedStories,
  toggleMatrixIncludeTrashed,
  settleEstimation
}) => {
  const columnWidth = getColWidth(cardConfig.length);
  const {t} = useContext(L10nContext);
  const [groupedStories, setGroupedStories] = useState({});

  useEffect(() => {
    setGroupedStories(
      deriveGroupedStories(estimatedStories, settlingStories, includeTrashedStories)
    );
  }, [estimatedStories, includeTrashedStories, settlingStories]);

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledEstimationMatrix data-testid="matrix">
        <StyledStoryTitle>
          {t('matrix')}
          <span onClick={toggleMatrixIncludeTrashed} className="clickable">
            <i className={includeTrashedStories ? 'icon-check' : 'icon-check-empty'}></i>{' '}
            {t('matrixIncludeTrashed')}
          </span>
        </StyledStoryTitle>

        <StyledEMColumnsContainer>
          {cardConfig.map((cc) => (
            <EstimationMatrixColumn
              onStoryDropped={settleEstimation}
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
    </DndProvider>
  );
};

EstimationMatrix.propTypes = {
  estimatedStories: PropTypes.array,
  cardConfig: PropTypes.array,
  settlingStories: PropTypes.array,
  includeTrashedStories: PropTypes.bool,
  toggleMatrixIncludeTrashed: PropTypes.func.isRequired,
  settleEstimation: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    estimatedStories: getAllStoriesWithConsensus(state),
    cardConfig: getCardConfigInOrder(state),
    includeTrashedStories: state.ui.matrixIncludeTrashedStories,
    settlingStories: getSettlingStories(state)
  }),
  {toggleMatrixIncludeTrashed, settleEstimation}
)(EstimationMatrix);

const getColWidth = (cardConfigCount) => {
  const colWidthPercentage = 99 / cardConfigCount;
  return Math.round((colWidthPercentage + Number.EPSILON) * 100) / 100;
};

/**
 * group stories according to estimation value.
 *
 * @param estimatedStories
 * @param settlingStories
 * @param includeTrashedStories
 * @return {object} Object that maps estimation value (consensus) to array of stories
 */
function deriveGroupedStories(estimatedStories, settlingStories, includeTrashedStories) {
  const stories = !includeTrashedStories
    ? estimatedStories.filter((s) => !s.trashed)
    : estimatedStories;

  return stories.reduce((total, current) => {
    const isSettling = settlingStories.find((ss) => ss.storyId === current.id);
    const consensus = isSettling ? isSettling.value : current.consensus;
    if (!total[consensus]) {
      total[consensus] = [];
    }
    total[consensus].push(current);
    return total;
  }, {});
}
