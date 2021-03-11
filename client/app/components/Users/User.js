import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getSelectedStory, isAStorySelected} from '../../state/stories/storiesSelectors';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';
import {getOwnUserId} from '../../state/users/usersSelectors';
import {L10nContext} from '../../services/l10n';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {kick} from '../../state/actions/commandActions';
import Avatar from '../common/Avatar';
import UserEstimationCard from './UserEstimationCard';

import {StyledUser, StyledUserBadge, StyledUserKickOverlay, StyledUserName} from './_styled';

const User = ({user, selectedStory, userHasEstimation, ownUserId, matchingCardConfig, kick}) => {
  const {t} = useContext(L10nContext);
  const isOwnUser = user.id === ownUserId;
  const isExcluded = user.excluded;
  const isDisconnected = user.disconnected;
  const revealed = selectedStory && selectedStory.revealed;

  const [isMarkedForKick, setMarkForKick] = useState(false);

  return (
    <StyledUser data-testid="user" isOwn={isOwnUser} shaded={isDisconnected || isMarkedForKick}>
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
        onClick={toggleMarkForKick}
        user={user}
        isOwn={user.id === ownUserId}
        shaded={isDisconnected || isMarkedForKick}
      />
      <StyledUserName>{user.username || '-'}</StyledUserName>

      {isMarkedForKick && (
        <StyledUserKickOverlay>
          <i className="icon-cancel" onClick={toggleMarkForKick} title={t('cancel')}></i>
          <i className="icon-logout" onClick={() => kick(user.id)} title={t('kickUser')}></i>
        </StyledUserKickOverlay>
      )}

      {selectedStory && (
        <UserEstimationCard
          isExcluded={isExcluded}
          userHasEstimation={userHasEstimation}
          revealed={revealed}
          matchingCardConfig={matchingCardConfig}
        />
      )}
    </StyledUser>
  );

  function toggleMarkForKick() {
    if (isOwnUser) {
      return; // no use in marking myself.. backend will prevent "kick" command for my own user anyways
    }
    setMarkForKick(!isMarkedForKick);
  }
};

User.propTypes = {
  user: PropTypes.object,
  userHasEstimation: PropTypes.bool,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  matchingCardConfig: PropTypes.object,
  kick: PropTypes.func.isRequired
};

export default connect(
  (state, props) => {
    const estimationsForStory = getEstimationsForCurrentlySelectedStory(state);
    const userEstimationValue = estimationsForStory && estimationsForStory[props.user.id];
    const userHasEstimation = userEstimationValue !== undefined && userEstimationValue !== null; // value could be "0" which is falsy, check for undefined

    const matchingCardConfig = userHasEstimation
      ? getMatchingCardConfig(state, userEstimationValue)
      : {};

    return {
      userHasEstimation,
      matchingCardConfig,
      ownUserId: getOwnUserId(state),
      selectedStory: isAStorySelected(state) ? getSelectedStory(state) : undefined
    };
  },
  {kick}
)(User);
