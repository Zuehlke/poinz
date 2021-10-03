import React from 'react';
import PropTypes from 'prop-types';

import {
  StyledUserEstimation,
  StyledUserEstimationExcluded,
  StyledUserEstimationGiven
} from './_styled';

/**
 * The area below the users' avatar, showing either a card "backside" (during estimation)
 * the estimated value of this user (after reveal)
 * or even a invisible placeholder for excluded users
 */
const UserEstimationCard = ({
  isExcluded,
  userEstimation,
  userHasEstimation,
  revealed,
  matchingCardConfig
}) => {
  const estimationValueToDisplay = userHasEstimation && revealed ? matchingCardConfig.label : 'Z';

  if (isExcluded) {
    return (
      <StyledUserEstimationExcluded>
        <span>-</span>
      </StyledUserEstimationExcluded>
    );
  }

  if (!userHasEstimation) {
    return (
      <StyledUserEstimation revealed={revealed}>
        <span>{estimationValueToDisplay}</span>
      </StyledUserEstimation>
    );
  }

  const showConfidenceMarker = !!(revealed && userEstimation.confidence);
  const showHighConfMarker = showConfidenceMarker && userEstimation.confidence > 0;
  const showLowConfMarker = showConfidenceMarker && userEstimation.confidence < 0;

  return (
    <StyledUserEstimationGiven
      revealed={revealed}
      valueColor={matchingCardConfig.color}
      data-testid={`${revealed ? 'revealed.' : ''}userEstimationGiven.${matchingCardConfig.value}`}
    >
      {showHighConfMarker && (
        <React.Fragment>
          <i className="icon icon-attention-alt"></i>
          <i className="icon icon-attention-alt"></i>
        </React.Fragment>
      )}

      {showLowConfMarker && (
        <React.Fragment>
          <i className="icon icon-help-1"></i>
          <i className="icon icon-help-1"></i>
        </React.Fragment>
      )}

      {estimationValueToDisplay}
    </StyledUserEstimationGiven>
  );
};

UserEstimationCard.propTypes = {
  isExcluded: PropTypes.bool,
  userEstimation: PropTypes.object,
  userHasEstimation: PropTypes.bool,
  revealed: PropTypes.bool,
  matchingCardConfig: PropTypes.object
};

export default UserEstimationCard;
