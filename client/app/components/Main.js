import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Room from './Room/Room';
import WhoAreYou from './Landing/WhoAreYou';
import AppStatus from './AppStatus/AppStatus';
import Landing from './Landing/Landing';
import appConfig from '../services/appConfig';

const getNormalizedRoomId = (pathname) => (pathname ? pathname.substr(1) : '');

/**
 * The Main component decides whether to display the landing page or the poinz estimation board (a room).
 * If the user did never set his username/name in a previous session, display "whoAreYou" with a username input field.
 * If the selected room matches the special id "poinzstatus" an app status view is displayed. (does not contain private data).
 */
const Main = ({roomId, users, userId, presetUsername, pathname}) => {
  const hasRoomIdAndUsers = roomId && users && Object.keys(users).length > 0 && userId;
  if (getNormalizedRoomId(pathname) === appConfig.APP_STATUS_IDENTIFIER) {
    return <AppStatus />;
  } else if (hasRoomIdAndUsers && presetUsername) {
    return <Room />;
  } else if (hasRoomIdAndUsers) {
    return <WhoAreYou />;
  } else {
    return <Landing />;
  }
};

Main.propTypes = {
  roomId: PropTypes.string,
  users: PropTypes.object,
  userId: PropTypes.string,
  presetUsername: PropTypes.string,
  pathname: PropTypes.string
};

export default connect((state) => ({
  pathname: state.pathname,
  roomId: state.roomId,
  users: state.users,
  userId: state.userId,
  presetUsername: state.presetUsername
}))(Main);
