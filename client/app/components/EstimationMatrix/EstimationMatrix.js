import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getActiveStoriesWithConsensus} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import ValueBadge from '../common/ValueBadge';
import {L10nContext} from '../../services/l10n';
import EstimationMatrixRow from './EstimationMatrixRow';

import {StyledEMRow, StyledEstimationMatrix, StyledEstimationMatrixCell} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * Display a table with all estimated stories (all stories with consensus), ordered by estimation value
 *
 */
const EstimationMatrix = ({estimatedStories, cardConfig}) => {
  const {t} = useContext(L10nContext);
  const hasEstimatedStories = estimatedStories.length > 0;
  estimatedStories.sort((sA, sB) => sA.consensus - sB.consensus);

  let columnWidth = getColWidth(cardConfig.length);

  return (
    <StyledEstimationMatrix data-testid="matrix">
      <StyledStoryTitle>{t('matrix')}</StyledStoryTitle>
      <StyledEMRow>
        <div>&nbsp;</div>
        {cardConfig.map((cc) => (
          <StyledEstimationMatrixCell key={'header:' + cc.value} width={columnWidth}>
            <ValueBadge cardValue={cc.value} />
          </StyledEstimationMatrixCell>
        ))}
      </StyledEMRow>

      {!hasEstimatedStories && (
        <StyledEMRow>
          <div>&nbsp;</div>
          <StyledEstimationMatrixCell width={80}>
            {t('noStoriesForMatrix')}
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
  const colWidthPercentage = 80 / cardConfigCount;
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
