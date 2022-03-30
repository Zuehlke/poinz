import React, {useContext, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getAllStoriesWithConsensus} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import {L10nContext} from '../../services/l10n';
import {toggleMatrixIncludeTrashed} from '../../state/actions/uiStateActions';
import {settleEstimation} from '../../state/actions/commandActions';
import EstimationMatrixColumn from './EstimationMatrixColumn';

import {StyledEMColumnsContainer, StyledEstimationMatrix, StyledNoStoriesHint} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * Displays a table with all estimated stories (all stories with consensus), ordered by estimation value
 */
const EstimationMatrix = ({
  estimatedStories,
  cardConfig,
  includeTrashedStories,
  toggleMatrixIncludeTrashed,
  settleEstimation
}) => {
  const columnWidth = getColWidth(cardConfig.length);
  const {t} = useContext(L10nContext);
  const [groupedStories, setGroupedStories] = useState({});

  useEffect(() => {
    setGroupedStories(deriveGroupedStories(estimatedStories, includeTrashedStories));
  }, [estimatedStories, includeTrashedStories]);

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
  );
};

EstimationMatrix.propTypes = {
  estimatedStories: PropTypes.array,
  cardConfig: PropTypes.array,
  includeTrashedStories: PropTypes.bool,
  toggleMatrixIncludeTrashed: PropTypes.func.isRequired,
  settleEstimation: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    estimatedStories: getAllStoriesWithConsensus(state),
    cardConfig: getCardConfigInOrder(state),
    includeTrashedStories: state.ui.matrixIncludeTrashedStories
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
 * @param includeTrashedStories
 * @return {object} Object that maps estimation value (consensus) to array of stories
 */
function deriveGroupedStories(estimatedStories, includeTrashedStories) {
  const stories = !includeTrashedStories
    ? estimatedStories.filter((s) => !s.trashed)
    : estimatedStories;

  return stories.reduce((total, current) => {
    if (!total[current.consensus]) {
      total[current.consensus] = [];
    }
    total[current.consensus].push(current);
    return total;
  }, {});
}
