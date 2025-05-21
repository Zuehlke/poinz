import React, {useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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

const TopBar = () => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();
  
  const backlogShown = useSelector(isBacklogShown);
  const sidebar = useSelector(getCurrentSidebarIfAny);
  const unseenError = useSelector(hasUnseenError);

  const handleLeaveRoom = () => dispatch(leaveRoom());
  const handleToggleBacklogSidebar = () => dispatch(toggleBacklogSidebar());
  const handleToggleSidebar = (sidebarType) => dispatch(toggleSidebar(sidebarType));

  return (
    <StyledTopBar data-testid="topBar">
      <StyledTopBarInner>
        <StyledTopLeft>
          <StyledBacklogToggle
            data-testid="backlogToggle"
            className={`clickable ${backlogShown ? 'pure-button-active' : ''}`}
            onClick={handleToggleBacklogSidebar}
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
            onClick={() => handleToggleSidebar(SIDEBAR_SETTINGS)}
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
            onClick={() => handleToggleSidebar(SIDEBAR_ACTIONLOG)}
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
            onClick={() => handleToggleSidebar(SIDEBAR_HELP)}
            title={t('help')}
          >
            <i className="icon-help"></i>
          </StyledQuickMenuButton>

          <StyledQuickMenuButton
            className="clickable pure-button pure-button-primary"
            onClick={handleLeaveRoom}
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

export default TopBar;
