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

const User = ({t, user, selectedStory, ownUserId, cardConfig, kick, toggleMarkForKick}) => {
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
      data-testid="user"
      isOwn={user.id === ownUserId}
      shaded={isDisconnected || isMarkedForKick}
    >
      {!isDisconnected && isExcluded && (
        <StyledUserBadge>
          <i className="icon-eye"></i>
        </StyledUserBadge>
      )}

      {isDisconnected && (
        <StyledUserBadge>
          <i className="icon-flash"></i>
        </StyledUserBadge>
      )}

      <Avatar
        onClick={onMarkForKick}
        user={user}
        isOwn={user.id === ownUserId}
        shaded={isDisconnected || isMarkedForKick}
      />
      <StyledUserName>{user.username || '-'}</StyledUserName>

      {isMarkedForKick && (
        <StyledUserKickOverlay>
          <i className="icon-cancel" onClick={onMarkForKick} title={t('cancel')}></i>
          <i className="icon-logout" onClick={() => kick(user.id)} title={t('kickUser')}></i>
        </StyledUserKickOverlay>
      )}

      {selectedStory && isExcluded && (
        <StyledUserEstimationExcluded>{estimationValueToDisplay}</StyledUserEstimationExcluded>
      )}

      {selectedStory && !userHasEstimation && !isExcluded && (
        <StyledUserEstimation revealed={revealed}>{estimationValueToDisplay}</StyledUserEstimation>
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
  t: PropTypes.func,
  user: PropTypes.object,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  cardConfig: PropTypes.array,
  kick: PropTypes.func.isRequired,
  toggleMarkForKick: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    cardConfig: state.cardConfig,
    ownUserId: state.userId,
    selectedStory: state.stories[state.selectedStory]
  }),
  {kick, toggleMarkForKick}
)(User);
