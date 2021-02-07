import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getCardConfigForValue} from '../../state/selectors/getCardConfigForValue';
import {toggleMarkForKick} from '../../state/actions/uiStateActions';
import {kick} from '../../state/actions/commandActions';
import {getEstimationsForCurrentlySelectedStory} from '../../state/selectors/storiesAndEstimates';
import Avatar from '../common/Avatar';

import {
  StyledUser,
  StyledUserBadge,
  StyledUserEstimation,
  StyledUserEstimationExcluded,
  StyledUserEstimationGiven,
  StyledUserKickOverlay,
  StyledUserName
} from './_styled';

const User = ({
  t,
  user,
  selectedStory,
  userHasEstimation,
  ownUserId,
  matchingCardConfig,
  kick,
  toggleMarkForKick
}) => {
  const isExcluded = user.excluded;
  const isDisconnected = user.disconnected;
  const isMarkedForKick = user.markedForKick;
  const revealed = selectedStory && selectedStory.revealed;

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
        <StyledUserEstimationExcluded>
          <span>-</span>
        </StyledUserEstimationExcluded>
      )}

      {selectedStory && !userHasEstimation && !isExcluded && (
        <StyledUserEstimation revealed={revealed}>
          <span>{estimationValueToDisplay}</span>
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
  t: PropTypes.func,
  user: PropTypes.object,
  userHasEstimation: PropTypes.bool,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  matchingCardConfig: PropTypes.object,
  kick: PropTypes.func.isRequired,
  toggleMarkForKick: PropTypes.func.isRequired
};

export default connect(
  (state, props) => {
    const estimationsForStory = getEstimationsForCurrentlySelectedStory(state);
    const userEstimationValue = estimationsForStory && estimationsForStory[props.user.id];
    const userHasEstimation = userEstimationValue !== undefined && userEstimationValue !== null; // value could be "0" which is falsy, check for undefined

    const matchingCardConfig = userHasEstimation
      ? getCardConfigForValue({
          ...state,
          cardConfigLookupValue: userEstimationValue
        })
      : {};

    return {
      t: state.translator,
      userHasEstimation,
      matchingCardConfig,
      ownUserId: state.userId,
      selectedStory: state.stories[state.selectedStory]
    };
  },
  {kick, toggleMarkForKick}
)(User);
