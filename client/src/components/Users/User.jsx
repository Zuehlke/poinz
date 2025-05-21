import React, {useState, useRef, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {getSelectedStory, isAStorySelected} from '../../state/stories/storiesSelectors';
import {getMatchingCardConfig} from '../../state/room/roomSelectors';
import {getOwnUserId} from '../../state/users/usersSelectors';
import {L10nContext} from '../../services/l10n';
import {getEstimationsForCurrentlySelectedStory} from '../../state/estimations/estimationsSelectors';
import {kick, toggleExcluded} from '../../state/actions/commandActions';
import Avatar from '../common/Avatar';
import UserEstimationCard from './UserEstimationCard';
import useOutsideClick from '../common/useOutsideClick';

import {
  StyledUser,
  StyledUserBadge,
  StyledUserQuickMenu,
  StyledUserName,
  StyledEyeIcon
} from './_styled';

const User = ({user}) => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();
  const quickMenuRef = useRef(null);

  const estimationsForStory = useSelector(getEstimationsForCurrentlySelectedStory);
  const userEstimation = estimationsForStory && estimationsForStory[user.id];
  const userHasEstimation = userEstimation !== undefined;
  const matchingCardConfig = useSelector(state => 
    userHasEstimation ? getMatchingCardConfig(state, userEstimation.value) : {}
  );
  const ownUserId = useSelector(getOwnUserId);
  const selectedStory = useSelector(state => isAStorySelected(state) ? getSelectedStory(state) : undefined);

  const isOwnUser = user.id === ownUserId;
  const isExcluded = user.excluded;
  const isDisconnected = user.disconnected;
  const revealed = selectedStory && selectedStory.revealed;

  useOutsideClick(quickMenuRef, () => setQuickMenuShown(false));

  const [quickMenuShown, setQuickMenuShown] = useState(false);

  const handleKick = (userId) => dispatch(kick(userId));
  const handleToggleExcluded = (userId) => dispatch(toggleExcluded(userId));

  const onEyeIconClick = () => {
    handleToggleExcluded(user.id);
    setQuickMenuShown(false);
  };

  return (
    <StyledUser data-testid="user" $isOwn={isOwnUser} $shaded={isDisconnected || quickMenuShown}>
      <StyledUserBadge>
        {isExcluded && <i className="icon-eye"></i>}
        {isDisconnected && <i className="icon-flash"></i>}
      </StyledUserBadge>

      <Avatar
        onClick={() => setQuickMenuShown(true)}
        user={user}
        isOwn={user.id === ownUserId}
        shaded={isDisconnected || quickMenuShown}
      />
      <StyledUserName>{user.username || '-'}</StyledUserName>

      {quickMenuShown && (
        <StyledUserQuickMenu ref={quickMenuRef}>
          <StyledEyeIcon
            $active={isExcluded}
            className="icon-eye"
            onClick={onEyeIconClick}
            title={t('markSpectator')}
          ></StyledEyeIcon>

          {!isOwnUser && (
            <i className="icon-logout" onClick={() => handleKick(user.id)} title={t('kickUser')}></i>
          )}
        </StyledUserQuickMenu>
      )}

      {selectedStory && (
        <UserEstimationCard
          isExcluded={isExcluded}
          userHasEstimation={userHasEstimation}
          userEstimation={userEstimation}
          revealed={revealed}
          matchingCardConfig={matchingCardConfig}
        />
      )}
    </StyledUser>
  );
};

User.propTypes = {
  user: PropTypes.object
};

export default User;
