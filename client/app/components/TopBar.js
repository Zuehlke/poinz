import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleBacklog, toggleSettings, toggleLog, toggleHelp, leaveRoom} from '../actions';
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
} from '../styled/TopBar';
import {getOwnUsername} from '../services/selectors';

const TopBar = ({
  t,
  roomId,
  username,
  leaveRoom,
  toggleBacklog,
  toggleSettings,
  toggleHelp,
  toggleLog,
  settingsShown,
  logShown,
  helpShown,
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
            settingsShown ? 'pure-button-active' : ''
          } `}
          onClick={toggleSettings}
          title={t('toggleMenu')}
        >
          <i className="icon-cog"></i>
        </StyledQuickMenuButton>
        <StyledQuickMenuButton
          data-testid="actionLogToggle"
          className={`clickable pure-button pure-button-primary ${
            logShown ? 'pure-button-active' : ''
          }`}
          warning={unseenError}
          onClick={toggleLog}
          title={t('toggleLog')}
        >
          <i className="icon-doc-text"></i>

          {unseenError && <StyledIconExclamation className="icon-attention-alt" />}
        </StyledQuickMenuButton>

        <StyledQuickMenuButton
          data-testid="helpToggle"
          className={`clickable pure-button pure-button-primary ${
            helpShown ? 'pure-button-active' : ''
          } `}
          onClick={toggleHelp}
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
  settingsShown: PropTypes.bool,
  backlogShown: PropTypes.bool,
  logShown: PropTypes.bool,
  helpShown: PropTypes.bool,
  unseenError: PropTypes.bool,
  username: PropTypes.string,
  roomId: PropTypes.string,
  toggleBacklog: PropTypes.func,
  toggleHelp: PropTypes.func,
  toggleSettings: PropTypes.func,
  leaveRoom: PropTypes.func,
  toggleLog: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    roomId: state.roomId,
    settingsShown: state.settingsShown,
    backlogShown: state.backlogShown,
    logShown: state.logShown,
    helpShown: state.helpShown,
    unseenError: state.unseenError,
    username: getOwnUsername(state)
  }),
  {toggleBacklog, toggleSettings, toggleHelp, toggleLog, leaveRoom}
)(TopBar);
