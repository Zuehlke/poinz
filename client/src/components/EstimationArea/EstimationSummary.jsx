import React, {useContext, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import getEstimationSummary from './getEstimationSummary';
import {getUserCount} from '../../state/users/usersSelectors';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {settleEstimation} from '../../state/actions/commandActions';
import {
  getSelectedStoryConsensusValue,
  getSelectedStoryId,
  hasSelectedStoryConsensus
} from '../../state/stories/storiesSelectors';
import {getCardConfigInOrder, getMatchingCardConfig} from '../../state/room/roomSelectors';

import EstimationSummaryCard from './EstimationSummaryCard';
import ValueBadge from '../common/ValueBadge';

import {StyledCardsWrapper, StyledEstimationSummary, StyledEstimationSummaryList} from './_styled';

const useEstimationSummary = () => {
  const dispatch = useDispatch();
  const estimations = useSelector(getEstimationsForCurrentlySelectedStory);
  const cardConfig = useSelector(getCardConfigInOrder);
  const storyId = useSelector(getSelectedStoryId);
  const usersInRoomCount = useSelector(getUserCount);
  const withConfidence = useSelector(state => state.room.withConfidence);
  const hasConsensus = useSelector(hasSelectedStoryConsensus);
  const consensusValue = useSelector(getSelectedStoryConsensusValue);
  const matchingConsensusCard = useSelector(state => 
    getMatchingCardConfig(state, getSelectedStoryConsensusValue(state))
  );

  const summaries = useSelector(state => 
    getEstimationSummary(estimations, cardConfig).map(summary => ({
      ...summary,
      recommendationCard: getMatchingCardConfig(state, summary.recommendation)
    }))
  );

  const handleSettleEstimation = (storyId, value) => {
    dispatch(settleEstimation(storyId, value));
  };

  return {
    storyId,
    usersInRoomCount,
    cardConfig,
    summaries,
    withConfidence,
    consensusInfo: {
      hasConsensus,
      value: consensusValue,
      label: matchingConsensusCard?.label
    },
    handleSettleEstimation
  };
};

const EstimationSummary = () => {
  const {t} = useContext(L10nContext);
  const [includeUnsureEstimations, setIncludeUnsureEstimations] = useState(true);
  
  const {
    storyId,
    usersInRoomCount,
    cardConfig,
    summaries,
    withConfidence,
    consensusInfo,
    handleSettleEstimation
  } = useEstimationSummary();

  const summary = includeUnsureEstimations ? summaries[0] : summaries[1];
  const allValuesSame = Object.keys(summary.estimatedValues).length === 1;
  const settled = consensusInfo.hasConsensus && !allValuesSame;

  const onCardClick = (value) => {
    handleSettleEstimation(storyId, value);
  };

  return (
    <StyledEstimationSummary data-testid="estimationSummary">
      <h5>{t('estimationSummary')}</h5>

      {withConfidence && (
        <p
          onClick={() => setIncludeUnsureEstimations(!includeUnsureEstimations)}
          className="clickable"
        >
          <i className={includeUnsureEstimations ? 'icon-check' : 'icon-check-empty'}></i>{' '}
          {t('includeUnsureEstimations')}
        </p>
      )}

      <StyledEstimationSummaryList>
        <span>
          {t('usersEstimated', {count: summary.estimationCount, total: usersInRoomCount})}
        </span>

        {!allValuesSame && (
          <span>
            {t('numericalAverage', {
              value: typeof summary.average !== 'undefined' ? summary.average : '-'
            })}
          </span>
        )}

        {summary.recommendation !== undefined &&
          summary.recommendationCard !== undefined &&
          !allValuesSame && (
            <span>
              {t('recommendation')}
              <ValueBadge
                cardValue={summary.recommendation}
                cardConfigItem={summary.recommendationCard}
              />
            </span>
          )}

        {allValuesSame && <span>{t('consensusAchieved')}</span>}
        {settled && (
          <span>
            {t('settledOn')}
            <ValueBadge cardValue={consensusInfo.value} />
          </span>
        )}
      </StyledEstimationSummaryList>

      <StyledCardsWrapper>
        {cardConfig.map((cardConfig) => (
          <EstimationSummaryCard
            t={t}
            onClick={() => onCardClick(cardConfig.value)}
            key={'mini-card_' + cardConfig.value}
            cardCfg={cardConfig}
            count={summary.estimatedValues[cardConfig.value]}
          />
        ))}
      </StyledCardsWrapper>
    </StyledEstimationSummary>
  );
};

EstimationSummary.propTypes = {
  storyId: PropTypes.string,
  summaries: PropTypes.array,
  cardConfig: PropTypes.array,
  withConfidence: PropTypes.bool,
  usersInRoomCount: PropTypes.number,
  consensusInfo: PropTypes.shape({
    hasConsensus: PropTypes.bool,
    value: PropTypes.number,
    label: PropTypes.string
  }),
  settleEstimation: PropTypes.func
};

export default EstimationSummary;
