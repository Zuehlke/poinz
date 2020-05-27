import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import appConfig from '../services/appConfig';
import {formatDateTime, secondsToDaysHoursMinutes} from '../services/timeUtil';
import {fetchStatus} from '../actions';

export const APP_STATUS_IDENTIFIER = 'poinzstatus';

/**
 * Our "operations" view. Displays application status (which is fetched from the backend via REST).
 * How many rooms, how many users.
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
      // this is an operations UI, it's ok to display a empty page during data loading...
      return null;
    }

    const uptime = secondsToDaysHoursMinutes(appStatus.uptime);

    const sortedActiveRooms = appStatus.rooms
      .filter((room) => room.userCount > room.userCountDisconnected)
      .sort(roomComparator);

    const sortedInActiveRooms = appStatus.rooms
      .filter((room) => room.userCount <= room.userCountDisconnected)
      .sort(roomComparator);

    return (
      <div className="app-status">
        <div className="top-bar">
          <div className="left-logo-container">
            <div className="poinz-logo">PoinZ</div>
          </div>
        </div>

        <button className="pure-button pure-button-primary" onClick={fetchStatus}>
          <i className="fa fa-refresh"></i>
        </button>

        <h4>PoinZ Application Status</h4>

        <p>
          Version: {appConfig.version} {formatDateTime(appConfig.buildTime)}
        </p>
        <p>Uptime: {uptime}</p>
        <p>Total rooms: {appStatus.roomCount}</p>

        <h5>Active Rooms</h5>
        <ul className="rooms rooms-active">
          <TableHeaders />
          {sortedActiveRooms.map((room, index) => (
            <RoomItem key={index} index={index} room={room} />
          ))}
        </ul>

        <h5>Inactive Rooms</h5>
        <ul className="rooms rooms-active">
          <TableHeaders />
          {sortedInActiveRooms.map((room, index) => (
            <RoomItem key={index} room={room} />
          ))}
        </ul>
      </div>
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
    <div>Total users</div>
    <div>Disconnected users</div>
    <div>Created</div>
    <div>Last Activity</div>
  </li>
);

const RoomItem = ({room}) => (
  <li>
    <div>{room.userCount}</div>
    <div>{room.userCountDisconnected}</div>
    <div>{formatDateTime(room.created)}</div>
    <div>{formatDateTime(room.lastActivity)}</div>
  </li>
);

RoomItem.propTypes = {
  room: PropTypes.object
};
