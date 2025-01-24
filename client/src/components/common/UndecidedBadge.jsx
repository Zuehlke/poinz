import React from 'react';
import PropTypes from 'prop-types';

import {StyledUndecidedBadge} from './_styled';

const UndecidedBadge = () => (
  <StyledUndecidedBadge data-testid="undecidedBadge">
    <div>-</div>
  </StyledUndecidedBadge>
);

UndecidedBadge.propTypes = {
  cardConfigItem: PropTypes.object
};

export default UndecidedBadge;
