import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SIDEBAR_SETTINGS} from '../../actions';
import UserSettings from './UserSettings';
import RoomSettings from './RoomSettings';

import {StyledLicenseHint, StyledSettings} from './_styled';

/**
 * The user menu allows customizing Poinz
 * - changing settings for the user like username, language, avatar, email
 * - changing settings for the room like autoReveal (affects the room and thus all users in the same room)
 */
const Settings = ({shown}) => {
  return (
    <StyledSettings shown={shown} data-testid="settings">
      <div className="pure-form">
        <UserSettings />

        <RoomSettings />
      </div>

      <StyledLicenseHint>
        Avatar Icons (c) by DELEKET{' '}
        <a href="https://www.deviantart.com/deleket">https://www.deviantart.com/deleket</a>
      </StyledLicenseHint>
    </StyledSettings>
  );
};

Settings.propTypes = {
  shown: PropTypes.bool
};

export default connect((state) => ({
  shown: state.sidebar === SIDEBAR_SETTINGS
}))(Settings);
