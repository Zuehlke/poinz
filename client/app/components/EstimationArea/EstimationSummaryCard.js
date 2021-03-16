import React from 'react';
import PropTypes from 'prop-types';

import {StyledEstmSummCard, StyledEstmSummCardInner} from './_styled';

/**
 * One card in the estimation summary
 */
const EstimationSummaryCard = ({t, cardCfg, count, clickable, onClick}) => {
  return (
    <StyledEstmSummCard
      data-testid={`summaryCard.${cardCfg.value}`}
      onClick={onCardButtonClick}
      clickable={clickable}
      title={clickable ? t('settle', {label: cardCfg.label}) : ''}
    >
      <StyledEstmSummCardInner wasEstimated={!!count} cardColor={cardCfg.color}>
        {cardCfg.label}
        {count && <span>{count}</span>}
      </StyledEstmSummCardInner>
    </StyledEstmSummCard>
  );

  function onCardButtonClick() {
    if (clickable) {
      onClick();
    }
  }
};

EstimationSummaryCard.propTypes = {
  t: PropTypes.func,
  cardCfg: PropTypes.object,
  clickable: PropTypes.bool,
  count: PropTypes.number,
  onClick: PropTypes.func
};

export default EstimationSummaryCard;
