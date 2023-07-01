import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SIDEBAR_SETTINGS} from '../../state/actions/uiStateActions';
import UserSettings from './UserSettings';
import RoomSettings from './RoomSettings';

import {StyledSettings} from './_styled';
import {getCurrentSidebarIfAny} from '../../state/ui/uiSelectors';

/**
 * The user menu allows customizing Poinz
 * - changing settings for the user like username, language, avatar, email
 * - changing settings for the room like autoReveal (affects the room and thus all users in the same room)
 */
const Settings = ({shown}) => (
  <StyledSettings $shown={shown} data-testid="settings">
    <form className="pure-form" onSubmit={(e) => e.preventDefault()}>
      <UserSettings />

      <RoomSettings />
    </form>
  </StyledSettings>
);

Settings.propTypes = {
  shown: PropTypes.bool
};

export default connect((state) => ({
  shown: getCurrentSidebarIfAny(state) === SIDEBAR_SETTINGS
}))(Settings);
