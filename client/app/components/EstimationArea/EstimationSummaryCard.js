import React from 'react';
import PropTypes from 'prop-types';

import {StyledEstmSummCard, StyledEstmSummCardInner} from './_styled';

/**
 * One card in the estimation summary
 */
const EstimationSummaryCard = ({cardCfg, count}) => (
  <StyledEstmSummCard>
    <StyledEstmSummCardInner wasEstimated={!!count} cardColor={cardCfg.color}>
      {cardCfg.label}
      {count && <span>{count}</span>}
    </StyledEstmSummCardInner>
  </StyledEstmSummCard>
);

EstimationSummaryCard.propTypes = {
  cardCfg: PropTypes.object,
  count: PropTypes.number
};

export default EstimationSummaryCard;
