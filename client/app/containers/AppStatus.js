import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import appConfig from '../services/appConfig';
import {formatDateTime, secondsToDaysHoursMinutes, timeAgo} from '../services/timeUtil';
import {fetchStatus, doGithubLogin} from '../actions';
import {StyledAppStatus, StyledRoomsList} from '../styled/AppStatus';
import {
  StyledPoinzLogo,
  StyledQuickMenuButton,
  StyledTopBar,
  StyledTopLeft,
  StyledTopRight
} from '../styled/TopBar';
import {StyledEyecatcher, StyledLanding, StyledLandingInner} from '../styled/Landing';

/**
 * Our "operations" view. Displays application status (which is fetched from the backend via REST).
 * How many rooms, how many users.
 *
 *   /api/status REST endpoint is protected. Authentication via github
 *
 */
const AppStatus = ({fetchStatus, appStatus, doGithubLogin, session}) => {
  useEffect(() => {
    if (!session || !session.jwt) {
      doGithubLogin();
    } else if (!appStatus) {
      fetchStatus();
    }
  }, [session, appStatus]);

  if (!appStatus) {
    // this is an operations UI, it's ok to display an empty page during data loading...
    return (
      <StyledLanding>
        <StyledLandingInner>
          <StyledEyecatcher>
            <div>Loading...</div>
          </StyledEyecatcher>
        </StyledLandingInner>
      </StyledLanding>
    );
  }

  const uptime = secondsToDaysHoursMinutes(appStatus.uptime);

  const sortedRooms = appStatus.rooms.sort(roomComparator);

  return (
    <StyledAppStatus data-testid="appStatusPage">
      <StyledTopBar data-testid="topBar">
        <StyledTopLeft>
          <StyledPoinzLogo>PoinZ</StyledPoinzLogo>
        </StyledTopLeft>

        <StyledTopRight>
          <StyledQuickMenuButton
            data-testid="reloadDataButton"
            className="clickable pure-button pure-button-primary"
            onClick={fetchStatus}
          >
            <i className="icon-arrows-cw"></i>
          </StyledQuickMenuButton>
          <StyledQuickMenuButton className="clickable pure-button pure-button-primary" href="/">
            <i className="icon-logout"></i>
          </StyledQuickMenuButton>
        </StyledTopRight>
      </StyledTopBar>

      <h2>PoinZ Application Status</h2>

      <p>
        Version: {appConfig.version} {formatDateTime(appConfig.buildTime)}
      </p>
      <p>Uptime: {uptime}</p>
      <p>Total rooms: {appStatus.roomCount}</p>
      <p>Running on: {appStatus.storeInfo}</p>

      <h3>Rooms</h3>

      <StyledRoomsList>
        <TableHeaders />
        {sortedRooms.map((room, index) => (
          <RoomItem key={index} room={room} />
        ))}
      </StyledRoomsList>
    </StyledAppStatus>
  );
};

AppStatus.propTypes = {
  fetchStatus: PropTypes.func,
  appStatus: PropTypes.object,
  doGithubLogin: PropTypes.func,
  session: PropTypes.object
};

function roomComparator(rA, rB) {
  const roomOneTimestamp = rA.lastActivity;
  const roomTwoTimestamp = rB.lastActivity;
  return roomTwoTimestamp - roomOneTimestamp;
}

export default connect(
  (state) => ({
    appStatus: state.appStatus,
    session: state.session
  }),
  {fetchStatus, doGithubLogin}
)(AppStatus);

const TableHeaders = () => (
  <li className="headers">
    <div>Id</div>
    <div>Users</div>
    <div>Active</div>
    <div>Stories</div>
    <div>Created</div>
    <div>Last Activity</div>
    <div>Marked for deletion</div>
  </li>
);

const RoomItem = ({room}) => (
  <li>
    <div>{room.id}</div>
    <div>{room.userCount}</div>
    <div>{room.userCount - room.userCountDisconnected}</div>
    <div>{room.storyCount}</div>
    <div title={formatDateTime(room.created)}>{timeAgo(room.created)}</div>
    <div title={formatDateTime(room.lastActivity)}>{timeAgo(room.lastActivity)}</div>
    <div>{room.markedForDeletion && <i className="icon-circle-empty"></i>}</div>
  </li>
);

RoomItem.propTypes = {
  room: PropTypes.object
};
