import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import getEstimationSummary from './getEstimationSummary';
import {getUserCount} from '../../state/users/usersSelectors';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {settleEstimation} from '../../state/actions/commandActions';
import {
  getSelectedStoryConsensusValue,
  hasSelectedStoryConsensus
} from '../../state/stories/storiesSelectors';
import EstimationSummaryCard from './EstimationSummaryCard';

import {StyledCards, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';
import {getCardConfigInOrder, getMatchingCardConfig} from '../../state/room/roomSelectors';

/**
 * Displays an overview on how many users did estimate, which cards how often. (after reveal)
 */
const EstimationSummary = ({
  estimations,
  usersInRoomCount,
  cardConfig,
  consensusInfo,
  settleEstimation
}) => {
  const {t} = useContext(L10nContext);
  const summary = getEstimationSummary(estimations);
  const allValuesSame = Object.keys(summary.estimatedValues).length === 1; // we cannot use "hasConsensus" property, because it is also set after (manually) "settling" the story.
  const settled = consensusInfo.hasConsensus && !allValuesSame;

  return (
    <StyledEstimationSummary data-testid="estimationSummary">
      <h5>{t('estimationSummary')}</h5>

      <StyledEstimationSummaryList>
        <span>
          {t('usersEstimated', {count: summary.estimationCount, total: usersInRoomCount})}
        </span>
        <span>{t('numericalAverage', {value: summary.average})}</span>

        {allValuesSame && <span>{t('consensusAchieved')}</span>}
        {settled && <span>{t('settledOn', {label: consensusInfo.label})}</span>}
      </StyledEstimationSummaryList>

      <StyledCards>
        {cardConfig.map((cardConfig) => (
          <EstimationSummaryCard
            t={t}
            clickable={canCardBeClicked(cardConfig)}
            onClick={() => onCardClick(cardConfig.value)}
            key={'mini-card_' + cardConfig.value}
            cardCfg={cardConfig}
            count={summary.estimatedValues[cardConfig.value]}
          />
        ))}
      </StyledCards>
    </StyledEstimationSummary>
  );

  function canCardBeClicked(cardConfig) {
    if (consensusInfo.hasConsensus && allValuesSame) {
      return false; // a "real" consensus was achieved, all users estimated the same value
    }

    const count = summary.estimatedValues[cardConfig.value];
    if (typeof count === 'undefined' || count < 1) {
      return false;
    }

    return consensusInfo.value !== cardConfig.value;
  }

  function onCardClick(value) {
    settleEstimation(value);
  }
};

EstimationSummary.propTypes = {
  estimations: PropTypes.object,
  cardConfig: PropTypes.array,
  usersInRoomCount: PropTypes.number,
  consensusInfo: PropTypes.shape({
    hasConsensus: PropTypes.bool,
    value: PropTypes.number,
    label: PropTypes.string
  }),
  settleEstimation: PropTypes.func
};

export default connect(
  (state) => ({
    estimations: getEstimationsForCurrentlySelectedStory(state),
    usersInRoomCount: getUserCount(state),
    cardConfig: getCardConfigInOrder(state),
    consensusInfo: {
      hasConsensus: hasSelectedStoryConsensus(state),
      value: getSelectedStoryConsensusValue(state),
      label: getMatchingCardConfig(state, getSelectedStoryConsensusValue(state)).label
    }
  }),
  {settleEstimation}
)(EstimationSummary);
