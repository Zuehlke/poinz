import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {getOwnUsername} from '../../state/users/usersSelectors';
import {leaveRoom} from '../../state/actions/commandActions';
import {
  toggleBacklogSidebar,
  toggleSidebar,
  SIDEBAR_HELP,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_SETTINGS
} from '../../state/actions/uiStateActions';
import {getRoomId} from '../../state/room/roomSelectors';
import {getCurrentSidebarIfAny, hasUnseenError, isBacklogShown} from '../../state/ui/uiSelectors';

import {
  StyledBacklogToggle,
  StyledBacklogToggleIcon,
  StyledTopLeft,
  StyledPoinzLogo,
  StyledTopRight,
  StyledQuickMenuButton,
  StyledTopBar,
  StyledWhoAmI,
  StyledWhoAmIExtended,
  StyledWhoAmISimple,
  StyledIconExclamation
} from './_styled';

const TopBar = ({
  roomId,
  username,
  leaveRoom,
  toggleSidebar,
  toggleBacklogSidebar,
  sidebar,
  unseenError,
  backlogShown
}) => {
  const {t} = useContext(L10nContext);
  const roomLink = <a href={'/' + roomId}>{roomId}</a>;

  return (
    <StyledTopBar data-testid="topBar">
      <StyledTopLeft>
        <StyledBacklogToggle
          data-testid="backlogToggle"
          className={`clickable ${backlogShown ? 'pure-button-active' : ''}`}
          onClick={toggleBacklogSidebar}
        >
          <StyledBacklogToggleIcon>
            <span></span>
          </StyledBacklogToggleIcon>
        </StyledBacklogToggle>
        <StyledPoinzLogo>PoinZ</StyledPoinzLogo>
      </StyledTopLeft>

      <StyledTopRight>
        <StyledWhoAmI>
          <StyledWhoAmISimple data-testid="whoamiSimple">{username}</StyledWhoAmISimple>
          <StyledWhoAmIExtended>
            {username} @ {roomLink}
          </StyledWhoAmIExtended>
        </StyledWhoAmI>

        <StyledQuickMenuButton
          data-testid="settingsToggle"
          className={`clickable pure-button pure-button-primary ${
            sidebar === SIDEBAR_SETTINGS ? 'pure-button-active' : ''
          } `}
          onClick={toggleSidebar.bind(undefined, SIDEBAR_SETTINGS)}
          title={t('toggleMenu')}
        >
          <i className="icon-cog"></i>
        </StyledQuickMenuButton>
        <StyledQuickMenuButton
          data-testid="actionLogToggle"
          className={`clickable pure-button pure-button-primary ${
            sidebar === SIDEBAR_ACTIONLOG ? 'pure-button-active' : ''
          }`}
          warning={unseenError}
          onClick={toggleSidebar.bind(undefined, SIDEBAR_ACTIONLOG)}
          title={t('toggleLog')}
        >
          <i className="icon-doc-text"></i>

          {unseenError && <StyledIconExclamation className="icon-attention-alt" />}
        </StyledQuickMenuButton>

        <StyledQuickMenuButton
          data-testid="helpToggle"
          className={`clickable pure-button pure-button-primary ${
            sidebar === SIDEBAR_HELP ? 'pure-button-active' : ''
          } `}
          onClick={toggleSidebar.bind(undefined, SIDEBAR_HELP)}
          title={t('help')}
        >
          <i className="icon-help"></i>
        </StyledQuickMenuButton>

        <StyledQuickMenuButton
          className="clickable pure-button pure-button-primary"
          onClick={leaveRoom}
          title={t('leaveRoom')}
        >
          <i className="icon-logout"></i>
        </StyledQuickMenuButton>
      </StyledTopRight>
    </StyledTopBar>
  );
};

TopBar.propTypes = {
  toggleBacklogSidebar: PropTypes.func,
  backlogShown: PropTypes.bool,
  unseenError: PropTypes.bool,
  username: PropTypes.string,
  roomId: PropTypes.string,
  toggleSidebar: PropTypes.func,
  sidebar: PropTypes.string,
  leaveRoom: PropTypes.func
};

export default connect(
  (state) => ({
    roomId: getRoomId(state),
    backlogShown: isBacklogShown(state),
    sidebar: getCurrentSidebarIfAny(state),
    unseenError: hasUnseenError(state),
    username: getOwnUsername(state)
  }),
  {toggleBacklogSidebar, toggleSidebar, leaveRoom}
)(TopBar);
