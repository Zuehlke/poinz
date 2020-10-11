import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Room from './Room';
import WhoAreYou from './WhoAreYou';
import AppStatus from './AppStatus';
import Landing from './Landing';
import appConfig from '../services/appConfig';
import {joinRoom, locationChanged} from '../actions';
import normalizePathname from '../services/normalizePathname';

/**
 * The Main component decides whether to display the landing page or the poinz estimation board (a room).
 * If the user did never set his username/name in a previous session, display "whoAreYou" with a username input field.
 * If the selected room matches the special id "poinzstatus" an app status view is displayed. (does not contain private data).
 */
const Main = ({roomId, users, userId, presetUsername, pathname}) => {
  const isAppStatusRoute = normalizePathname(pathname).startsWith(appConfig.APP_STATUS_IDENTIFIER);
  const hasRoomIdAndUsers = roomId && users && Object.keys(users).length > 0 && userId;

  if (isAppStatusRoute) {
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
  joinRoom: PropTypes.func,
  locationChanged: PropTypes.func,
  roomId: PropTypes.string,
  pathname: PropTypes.string,
  users: PropTypes.object,
  userId: PropTypes.string,
  presetUsername: PropTypes.string
};

export default connect(
  (state) => ({
    pathname: state.pathname,
    roomId: state.roomId,
    users: state.users,
    userId: state.userId,
    presetUsername: state.presetUsername
  }),
  {joinRoom, locationChanged}
)(Main);
