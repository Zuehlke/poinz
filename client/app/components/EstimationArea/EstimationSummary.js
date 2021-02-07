import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import getEstimationSummary from './getEstimationSummary';
import EstimationSummaryCard from './EstimationSummaryCard';
import {getUserCount} from '../../state/selectors/users';
import {
  getEstimationsForCurrentlySelectedStory,
  hasSelectedStoryConsensus
} from '../../state/selectors/storiesAndEstimates';

import {StyledCards, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';

/**
 * Displays an overview on how many users did estimate, which cards how often. (after reveal)
 */
const EstimationSummary = ({t, estimations, usersInRoomCount, cardConfig, hasConsensus}) => {
  const summary = getEstimationSummary(estimations);

  return (
    <StyledEstimationSummary>
      <h4>{t('estimationSummary')}</h4>

      <StyledEstimationSummaryList>
        <span>
          {t('usersEstimated', {count: summary.estimationCount, total: usersInRoomCount})}
        </span>

        {hasConsensus && <span>{t('consensusAchieved')}</span>}
      </StyledEstimationSummaryList>

      <StyledCards>
        {cardConfig.map((cardConfig) => (
          <EstimationSummaryCard
            key={'mini-card_' + cardConfig.value}
            cardCfg={cardConfig}
            count={summary.estimatedValues[cardConfig.value]}
          />
        ))}
      </StyledCards>
    </StyledEstimationSummary>
  );
};

EstimationSummary.propTypes = {
  t: PropTypes.func.isRequired,
  estimations: PropTypes.object,
  cardConfig: PropTypes.array,
  usersInRoomCount: PropTypes.number,
  hasConsensus: PropTypes.bool
};

export default connect((state) => ({
  t: state.translator,
  estimations: getEstimationsForCurrentlySelectedStory(state),
  usersInRoomCount: getUserCount(state),
  cardConfig: state.cardConfig,
  hasConsensus: hasSelectedStoryConsensus(state)
}))(EstimationSummary);
