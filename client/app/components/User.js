import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {kick, toggleMarkForKick} from '../actions';
import Avatar from './Avatar.js';
import {getCardConfigForValue} from '../services/getCardConfigForValue';
import {
  StyledUser,
  StyledUserName,
  StyledUserBadge,
  StyledUserEstimation,
  StyledUserEstimationGiven,
  StyledUserEstimationExcluded,
  StyledUserKickOverlay
} from '../styled/User';

const User = ({user, selectedStory, ownUserId, cardConfig, kick, toggleMarkForKick}) => {
  const isExcluded = user.excluded;
  const isDisconnected = user.disconnected;
  const isMarkedForKick = user.markedForKick;
  const revealed = selectedStory && selectedStory.revealed;

  const userEstimationValue = selectedStory && selectedStory.estimations[user.id];
  const userHasEstimation = userEstimationValue !== undefined; // value could be "0" which is falsy, check for undefined

  const matchingCardConfig = getCardConfigForValue(cardConfig, userEstimationValue);
  const estimationValueToDisplay = userHasEstimation && revealed ? matchingCardConfig.label : 'Z';

  return (
    <StyledUser
      onClick={onMarkForKick}
      isOwn={user.id === ownUserId}
      shaded={isDisconnected || isMarkedForKick}
    >
      {!isDisconnected && isExcluded && (
        <StyledUserBadge>
          <i className="fa fa-eye"></i>
        </StyledUserBadge>
      )}

      {isDisconnected && (
        <StyledUserBadge>
          <i className="fa fa-flash"></i>
        </StyledUserBadge>
      )}

      <Avatar
        user={user}
        isOwn={user.id === ownUserId}
        shaded={isDisconnected || isMarkedForKick}
      />
      <StyledUserName>{user.username || '-'}</StyledUserName>

      {isMarkedForKick && (
        <StyledUserKickOverlay>
          <i className="fa fa-sign-out" onClick={() => kick(user.id)}></i>
        </StyledUserKickOverlay>
      )}

      {selectedStory && isExcluded && (
        <StyledUserEstimationExcluded>{estimationValueToDisplay}</StyledUserEstimationExcluded>
      )}

      {selectedStory && !userHasEstimation && !isExcluded && (
        <StyledUserEstimation revealed={revealed}>
          {' '}
          {estimationValueToDisplay}{' '}
        </StyledUserEstimation>
      )}

      {selectedStory && userHasEstimation && !isExcluded && (
        <StyledUserEstimationGiven revealed={revealed} valueColor={matchingCardConfig.color}>
          {estimationValueToDisplay}
        </StyledUserEstimationGiven>
      )}
    </StyledUser>
  );

  function onMarkForKick() {
    toggleMarkForKick(user.id);
  }
};

User.propTypes = {
  user: PropTypes.object,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  cardConfig: PropTypes.array,
  kick: PropTypes.func.isRequired,
  toggleMarkForKick: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    cardConfig: state.cardConfig,
    ownUserId: state.userId,
    selectedStory: state.stories[state.selectedStory]
  }),
  {kick, toggleMarkForKick}
)(User);
