import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import getEstimationSummary from './getEstimationSummary';
import EstimationSummaryCard from './EstimationSummaryCard';
import {getUserCount} from '../../state/users/usersSelectors';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {hasSelectedStoryConsensus} from '../../state/stories/storiesSelectors';

import {StyledCards, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';
import {getT} from '../../state/ui/uiSelectors';

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
  t: getT(state),
  estimations: getEstimationsForCurrentlySelectedStory(state),
  usersInRoomCount: getUserCount(state),
  cardConfig: getCardConfigInOrder(state),
  hasConsensus: hasSelectedStoryConsensus(state)
}))(EstimationSummary);
