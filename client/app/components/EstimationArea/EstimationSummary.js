import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';
import {
  getEstimationsForCurrentlySelectedStory,
  getUserCount,
  hasSelectedStoryConsensus
} from '../../services/selectors';
import getEstimationSummary from '../../services/getEstimationSummary';
import ConsensusBadge from '../common/ConsensusBadge';

/**
 * One estimation card on the board.
 */
const EstimationSummary = ({t, estimations, usersInRoomCount, cardConfig, hasConsensus}) => {
  const summary = getEstimationSummary(estimations);

  return (
    <StyledEstimationSummary>
      <h4>{t('estimationSummary')}</h4>

      <StyledEstimationSummaryList>
        <span>{t('usersEstimated')}</span>
        <span>
          {summary.estimationCount} / {usersInRoomCount}
        </span>

        {!hasConsensus && summary.estimationCount > 0 && (
          <React.Fragment>
            <span>{t('lowestValue')}</span>
            <span>
              <ConsensusBadge cardConfig={cardConfig} consensusValue={summary.lowest} />
            </span>
            <span>{t('highestValue')}</span>
            <span>
              <ConsensusBadge cardConfig={cardConfig} consensusValue={summary.highest} />
            </span>
            <span>{t('average')}</span>
            <span>{summary.average}</span>
          </React.Fragment>
        )}

        {hasConsensus && (
          <React.Fragment>
            <span>{t('consensusAchieved')}</span>
            <span>
              <ConsensusBadge cardConfig={cardConfig} consensusValue={summary.highest} />
            </span>
          </React.Fragment>
        )}
      </StyledEstimationSummaryList>
    </StyledEstimationSummary>
  );
};

EstimationSummary.propTypes = {
  t: PropTypes.function.isRequired,
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
  }),
  {}
)(EstimationSummary);
