import React, {useContext, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getAllStoriesWithConsensus} from '../../state/stories/storiesSelectors';
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
  const [includeTrashedStories, setIncludeTrashedStories] = useState(false);
  const [filteredAndSortedStories, setFilteredAndSortedStories] = useState([]);

  useEffect(() => {
    const stories = !includeTrashedStories
      ? estimatedStories.filter((s) => !s.trashed)
      : estimatedStories;
    stories.sort(
      (sA, sB) =>
        cardConfig.findIndex((cc) => cc.value === sA.consensus) -
        cardConfig.findIndex((cc) => cc.value === sB.consensus)
    );

    setFilteredAndSortedStories(stories);
  }, [estimatedStories, includeTrashedStories]);

  const {t} = useContext(L10nContext);

  let columnWidth = getColWidth(cardConfig.length);

  return (
    <StyledEstimationMatrix data-testid="matrix">
      <StyledStoryTitle>
        {t('matrix')}
        <span
          onClick={() => setIncludeTrashedStories(!includeTrashedStories)}
          className="clickable"
        >
          <i className={includeTrashedStories ? 'icon-check' : 'icon-check-empty'}></i>{' '}
          {t('matrixIncludeTrashed')}
        </span>
      </StyledStoryTitle>

      <StyledEMRow>
        {cardConfig.map((cc) => (
          <StyledEstimationMatrixCell key={'header:' + cc.value} width={columnWidth}>
            <ValueBadge cardValue={cc.value} />
          </StyledEstimationMatrixCell>
        ))}
      </StyledEMRow>

      {filteredAndSortedStories.length < 1 && (
        <StyledEMRow>
          <StyledEstimationMatrixCell width={99}>
            <StyledNoStoriesHint>{t('noStoriesForMatrix')}</StyledNoStoriesHint>
          </StyledEstimationMatrixCell>
        </StyledEMRow>
      )}

      {filteredAndSortedStories.map((story) => (
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
  estimatedStories: getAllStoriesWithConsensus(state),
  cardConfig: getCardConfigInOrder(state)
}))(EstimationMatrix);
