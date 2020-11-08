import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import appConfig from '../../services/appConfig';
import {formatDateTime, secondsToDaysHoursMinutes, timeAgo} from '../../services/timeUtil';
import {fetchStatus} from '../../actions';
import {
  StyledPoinzLogo,
  StyledQuickMenuButton,
  StyledTopBar,
  StyledTopLeft,
  StyledTopRight
} from '../TopBar/_styled';

import {StyledAppStatus, StyledRoomsList} from './_styled';

/**
 * Our "operations" view. Displays application status (which is fetched from the backend via REST).
 * How many rooms, how many users.
 * Does not display room names, since this page is publicly accessible.
 */
class AppStatus extends React.Component {
  componentDidMount() {
    const {fetchStatus, appStatus} = this.props;

    if (!appStatus) {
      fetchStatus();
    }
  }

  render() {
    const {fetchStatus, appStatus} = this.props;
    if (!appStatus) {
      // this is an operations UI, it's ok to display an empty page during data loading...
      return null;
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
  }
}

AppStatus.propTypes = {
  fetchStatus: PropTypes.func,
  appStatus: PropTypes.object
};

function roomComparator(rA, rB) {
  const roomOneTimestamp = rA.lastActivity;
  const roomTwoTimestamp = rB.lastActivity;
  return roomOneTimestamp < roomTwoTimestamp ? 1 : roomTwoTimestamp < roomOneTimestamp ? -1 : 0;
}

export default connect(
  (state) => ({
    appStatus: state.appStatus
  }),
  {fetchStatus}
)(AppStatus);

const TableHeaders = () => (
  <li className="headers">
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
