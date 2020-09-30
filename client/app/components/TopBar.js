import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleBacklog, toggleUserMenu, toggleLog, leaveRoom} from '../actions';
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
  StyledWhoAmISimple
} from '../styled/TopBar';

const TopBar = ({
  t,
  roomId,
  username,
  leaveRoom,
  toggleBacklog,
  toggleUserMenu,
  toggleLog,
  userMenuShown,
  logShown,
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
          data-testid="userMenuToggle"
          className={`clickable pure-button pure-button-primary ${
            userMenuShown ? 'pure-button-active' : ''
          } `}
          onClick={toggleUserMenu}
          title={t('toggleMenu')}
        >
          <i className="fa fa-cog"></i>
        </StyledQuickMenuButton>
        <StyledQuickMenuButton
          data-testid="actionLogToggle"
          className={`clickable pure-button pure-button-primary ${
            logShown ? 'pure-button-active' : ''
          }`}
          onClick={toggleLog}
          title={t('toggleLog')}
        >
          <i className="fa fa-list"></i>
        </StyledQuickMenuButton>

        <StyledQuickMenuButton
          className="clickable pure-button pure-button-primary"
          onClick={leaveRoom}
          title={t('leaveRoom')}
        >
          <i className="fa fa-sign-out"></i>
        </StyledQuickMenuButton>
      </StyledTopRight>
    </StyledTopBar>
  );
};

TopBar.propTypes = {
  t: PropTypes.func,
  userMenuShown: PropTypes.bool,
  backlogShown: PropTypes.bool,
  logShown: PropTypes.bool,
  username: PropTypes.string,
  roomId: PropTypes.string,
  toggleBacklog: PropTypes.func,
  toggleUserMenu: PropTypes.func,
  leaveRoom: PropTypes.func,
  toggleLog: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    roomId: state.roomId,
    userMenuShown: state.userMenuShown,
    backlogShown: state.backlogShown,
    logShown: state.logShown,
    username: state.users && state.users[state.userId] ? state.users[state.userId].username : '-'
  }),
  {toggleBacklog, toggleUserMenu, toggleLog, leaveRoom}
)(TopBar);
