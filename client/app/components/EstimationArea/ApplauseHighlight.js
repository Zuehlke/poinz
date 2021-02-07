import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../../state/selectors/getCardConfigForValue';
import {StyledApplauseHighlight} from './_styled';

const ApplauseHighlight = ({matchingCardConfig}) => {
  const highlightColor = matchingCardConfig.color;
  return (
    <StyledApplauseHighlight
      style={{boxShadow: '0 0 10px ' + highlightColor, border: '1px solid ' + highlightColor}}
    ></StyledApplauseHighlight>
  );
};

ApplauseHighlight.propTypes = {
  consensusValue: PropTypes.number,
  matchingCardConfig: PropTypes.object
};

export default connect((state, props) => ({
  matchingCardConfig: getCardConfigForValue({...state, cardConfigLookupValue: props.consensusValue})
}))(ApplauseHighlight);
