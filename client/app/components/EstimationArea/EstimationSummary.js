import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {StyledCards, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';
import {
  getEstimationsForCurrentlySelectedStory,
  getUserCount,
  hasSelectedStoryConsensus
} from '../../services/selectors';
import getEstimationSummary from '../../services/getEstimationSummary';
import EstimationSummaryCard from './EstimationSummaryCard';

/**
 * One estimation card on the board.
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

export default connect(
  (state) => ({
    t: state.translator,
    estimations: getEstimationsForCurrentlySelectedStory(state),
    usersInRoomCount: getUserCount(state),
    cardConfig: state.cardConfig,
    hasConsensus: hasSelectedStoryConsensus(state)
  })
)(EstimationSummary);
