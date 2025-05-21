import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {StyledValueBadge} from './_styled';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';

const ValueBadge = ({cardValue}) => {
  const cardConfigItem = useSelector(state => getMatchingCardConfig(state, cardValue));

  return (
    <StyledValueBadge
      $cardColor={cardConfigItem && cardConfigItem.color}
      data-testid="cardValueBadge"
    >
      <div>{cardConfigItem.label}</div>
    </StyledValueBadge>
  );
};

ValueBadge.propTypes = {
  cardValue: PropTypes.number
};

export default ValueBadge;
