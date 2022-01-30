import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getActiveStoriesWithConsensus} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import ValueBadge from '../common/ValueBadge';
import {L10nContext} from '../../services/l10n';
import EstimationMatrixRow from './EstimationMatrixRow';

import {
  StyledEMRow,
  StyledEstimationMatrix,
  StyledEstimationMatrixCell,
  StyledNoStoriesHint
} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * Displays a table with all estimated stories (all stories with consensus), ordered by estimation value
 */
const EstimationMatrix = ({estimatedStories, cardConfig}) => {
  const {t} = useContext(L10nContext);
  const hasEstimatedStories = estimatedStories.length > 0;
  estimatedStories.sort(
    (sA, sB) =>
      cardConfig.findIndex((cc) => cc.value === sA.consensus) -
      cardConfig.findIndex((cc) => cc.value === sB.consensus)
  );

  let columnWidth = getColWidth(cardConfig.length);

  return (
    <StyledEstimationMatrix data-testid="matrix">
      <StyledStoryTitle>{t('matrix')}</StyledStoryTitle>
      <StyledEMRow>
        {cardConfig.map((cc) => (
          <StyledEstimationMatrixCell key={'header:' + cc.value} width={columnWidth}>
            <ValueBadge cardValue={cc.value} />
          </StyledEstimationMatrixCell>
        ))}
      </StyledEMRow>

      {!hasEstimatedStories && (
        <StyledEMRow>
          <StyledEstimationMatrixCell width={99}>
            <StyledNoStoriesHint>{t('noStoriesForMatrix')}</StyledNoStoriesHint>
          </StyledEstimationMatrixCell>
        </StyledEMRow>
      )}

      {estimatedStories.map((story) => (
        <EstimationMatrixRow
          story={story}
          key={story.id}
          cardConfig={cardConfig}
          columnWidthPercentage={columnWidth}
        />
      ))}
    </StyledEstimationMatrix>
  );
};

const getColWidth = (cardConfigCount) => {
  const colWidthPercentage = 99 / cardConfigCount;
  return Math.round((colWidthPercentage + Number.EPSILON) * 100) / 100;
};

EstimationMatrix.propTypes = {
  estimatedStories: PropTypes.array,
  cardConfig: PropTypes.array
};

export default connect((state) => ({
  estimatedStories: getActiveStoriesWithConsensus(state),
  cardConfig: getCardConfigInOrder(state)
}))(EstimationMatrix);
