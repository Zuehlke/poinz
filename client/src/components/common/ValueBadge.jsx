import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {StyledValueBadge} from './_styled';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';

const ValueBadge = ({cardConfigItem}) => (
  <StyledValueBadge
    $cardColor={cardConfigItem && cardConfigItem.color}
    data-testid="cardValueBadge"
  >
    <div>{cardConfigItem.label}</div>
  </StyledValueBadge>
);

ValueBadge.propTypes = {
  cardValue: PropTypes.number,
  cardConfigItem: PropTypes.object
};

export default connect((state, props) => ({
  cardConfigItem: getMatchingCardConfig(state, props.cardValue)
}))(ValueBadge);
