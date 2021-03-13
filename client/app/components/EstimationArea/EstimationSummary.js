import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import getEstimationSummary from './getEstimationSummary';
import {getUserCount} from '../../state/users/usersSelectors';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {concludeEstimation} from '../../state/actions/commandActions';
import {
  getSelectedStoryConsensusValue,
  hasSelectedStoryConsensus
} from '../../state/stories/storiesSelectors';
import EstimationSummaryCard from './EstimationSummaryCard';

import {StyledCards, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';
import {getCardConfigInOrder} from '../../state/room/roomSelectors';

/**
 * Displays an overview on how many users did estimate, which cards how often. (after reveal)
 */
const EstimationSummary = ({
  estimations,
  usersInRoomCount,
  cardConfig,
  hasConsensus,
  consensusValue,
  concludeEstimation
}) => {
  const {t} = useContext(L10nContext);
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
            onClick={() => onCardClick(cardConfig.value)}
            key={'mini-card_' + cardConfig.value}
            cardCfg={cardConfig}
            count={summary.estimatedValues[cardConfig.value]}
          />
        ))}
      </StyledCards>
    </StyledEstimationSummary>
  );

  function onCardClick(value) {
    if (summary.estimatedValues[value] > 0 && consensusValue !== value) {
      concludeEstimation(value);
    }
  }
};

EstimationSummary.propTypes = {
  estimations: PropTypes.object,
  cardConfig: PropTypes.array,
  usersInRoomCount: PropTypes.number,
  hasConsensus: PropTypes.bool,
  consensusValue: PropTypes.number,
  concludeEstimation: PropTypes.func
};

export default connect(
  (state) => ({
    estimations: getEstimationsForCurrentlySelectedStory(state),
    usersInRoomCount: getUserCount(state),
    cardConfig: getCardConfigInOrder(state),
    hasConsensus: hasSelectedStoryConsensus(state),
    consensusValue: getSelectedStoryConsensusValue(state)
  }),
  {concludeEstimation}
)(EstimationSummary);
