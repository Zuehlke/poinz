import React from 'react';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../../services/getCardConfigForValue';
import {StyledApplauseHighlight} from './_styled';

const ApplauseHighlight = ({cardConfig, consensusValue}) => {
  if (!consensusValue) {
    return null;
  }

  const matchingCardConfig = getCardConfigForValue(cardConfig, consensusValue);
  const highlightColor = matchingCardConfig.color;
  return (
    <StyledApplauseHighlight
      style={{boxShadow: '0 0 10px ' + highlightColor, border: '1px solid ' + highlightColor}}
    ></StyledApplauseHighlight>
  );
};

ApplauseHighlight.propTypes = {
  cardConfig: PropTypes.array,
  consensusValue: PropTypes.number
};

export default ApplauseHighlight;
