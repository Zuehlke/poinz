import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
  toggleBacklog,
  toggleSidebar,
  leaveRoom,
  SIDEBAR_HELP,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_SETTINGS
} from '../../actions';
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
import {getOwnUsername} from '../../services/selectors';

const TopBar = ({
  t,
  roomId,
  username,
  leaveRoom,
  toggleSidebar,
  toggleBacklog,
  sidebar,
  unseenError,
  backlogShown
}) => {
  const roomLink = <a href={'/' + roomId}>{roomId}</a>;

  return (
    <StyledTopBar data-testid="topBar">
      <StyledTopLeft>
        <StyledBacklogToggle
          data-testid="backlogToggle"
          className={`clickable ${backlogShown ? 'pure-button-active' : ''}`}
          onClick={toggleBacklog}
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
  t: PropTypes.func,
  toggleBacklog: PropTypes.func,
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
    t: state.translator,
    roomId: state.roomId,
    backlogShown: state.backlogShown,
    sidebar: state.sidebar,
    unseenError: state.unseenError,
    username: getOwnUsername(state)
  }),
  {toggleBacklog, toggleSidebar, leaveRoom}
)(TopBar);
