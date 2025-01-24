import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {leaveRoom} from '../../state/actions/commandActions';
import WhoAmI from './WhoAmI';
import {
  toggleBacklogSidebar,
  toggleSidebar,
  SIDEBAR_HELP,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_SETTINGS
} from '../../state/actions/uiStateActions';
import {getCurrentSidebarIfAny, hasUnseenError, isBacklogShown} from '../../state/ui/uiSelectors';

import {
  StyledBacklogToggle,
  StyledBacklogToggleIcon,
  StyledTopLeft,
  StyledPoinzLogo,
  StyledTopRight,
  StyledQuickMenuButton,
  StyledTopBar,
  StyledIconExclamation,
  StyledTopBarInner
} from './_styled';

const TopBar = ({
  leaveRoom,
  toggleSidebar,
  toggleBacklogSidebar,
  sidebar,
  unseenError,
  backlogShown
}) => {
  const {t} = useContext(L10nContext);

  return (
    <StyledTopBar data-testid="topBar">
      <StyledTopBarInner>
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
          <StyledPoinzLogo data-testid="logo">Poinz</StyledPoinzLogo>
        </StyledTopLeft>

        <StyledTopRight>
          <WhoAmI />

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
            $warning={unseenError}
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
      </StyledTopBarInner>
    </StyledTopBar>
  );
};

TopBar.propTypes = {
  toggleBacklogSidebar: PropTypes.func,
  backlogShown: PropTypes.bool,
  unseenError: PropTypes.bool,
  toggleSidebar: PropTypes.func,
  sidebar: PropTypes.string,
  leaveRoom: PropTypes.func
};

export default connect(
  (state) => ({
    backlogShown: isBacklogShown(state),
    sidebar: getCurrentSidebarIfAny(state),
    unseenError: hasUnseenError(state)
  }),
  {toggleBacklogSidebar, toggleSidebar, leaveRoom}
)(TopBar);
