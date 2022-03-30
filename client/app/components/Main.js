import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Room from './Room/Room';
import WhoAreYou from './Landing/WhoAreYou';
import AppStatus from './AppStatus/AppStatus';
import Landing from './Landing/Landing';
import appConfig from '../services/appConfig';
import RoomProtected from './Landing/RoomProtected';
import {getOwnUserId, getUserCount} from '../state/users/usersSelectors';
import {getRoomId} from '../state/room/roomSelectors';
import {getJoinRoomId, getJoinUserdata, hasJoinFailedAuth} from '../state/joining/joiningSelectors';

const getNormalizedRoomId = (pathname) => (pathname ? pathname.substr(1) : '');

/**
 * The Main component switches between top-level views (somewhat a basic routing).
 */
const Main = ({
  roomDataIsLoaded,
  roomId,
  hasJoinFailedAuth,
  isAppStatusUrlPath,
  joinUserdata,
  joinRoomId
}) => {
  if (isAppStatusUrlPath) {
    return <AppStatus />;
  } else if (hasJoinFailedAuth) {
    return <RoomProtected />;
  } else if (roomDataIsLoaded) {
    return <Room roomId={roomId} />;
  } else if (joinRoomId && !joinUserdata.username) {
    return <WhoAreYou />;
  } else {
    return <Landing />;
  }
};

Main.propTypes = {
  hasJoinFailedAuth: PropTypes.bool,
  joinUserdata: PropTypes.object,
  joinRoomId: PropTypes.string, // roomId during join workflow
  roomId: PropTypes.string, // roomId after successful join
  roomDataIsLoaded: PropTypes.bool,
  isAppStatusUrlPath: PropTypes.bool
};

export default connect((state) => ({
  roomDataIsLoaded: getRoomId(state) && getUserCount(state) > 0 && !!getOwnUserId(state),
  roomId: getRoomId(state),
  joinUserdata: getJoinUserdata(state),
  joinRoomId: getJoinRoomId(state),
  hasJoinFailedAuth: hasJoinFailedAuth(state),
  isAppStatusUrlPath: getNormalizedRoomId(state.ui.pathname) === appConfig.APP_STATUS_IDENTIFIER
}))(Main);
