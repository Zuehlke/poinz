import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import appConfig from '../../services/appConfig';
import {formatDateTime, secondsToDaysHoursMinutes, timeAgo} from '../../services/timeUtil';
import {getAppStatus} from '../../services/restApi/appStatusService';

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
const AppStatus = () => {
  const [appStatus, setAppStatus] = useState();

  useEffect(() => {
    loadAndSet();
  }, []);

  if (!appStatus) {
    // this is an operations UI, it's ok to display an empty page during data loading...
    return null;
  }

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
            onClick={loadAndSet}
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
      <p>Uptime: {appStatus.uptime}</p>
      <p>Total rooms: {appStatus.roomCount}</p>
      <p>Running on: {appStatus.storeInfo}</p>

      <h3>Rooms</h3>

      <StyledRoomsList>
        <TableHeaders />
        {appStatus.rooms.map((room, index) => (
          <RoomItem key={index} room={room} />
        ))}
      </StyledRoomsList>
    </StyledAppStatus>
  );

  function loadAndSet() {
    getAppStatus().then((data) => {
      data.uptime = secondsToDaysHoursMinutes(data.uptime);
      data.rooms.sort(roomComparator);
      setAppStatus(data);
    });
  }
};

AppStatus.propTypes = {
  fetchStatus: PropTypes.func,
  appStatus: PropTypes.object
};

function roomComparator(rA, rB) {
  const roomOneTimestamp = rA.lastActivity;
  const roomTwoTimestamp = rB.lastActivity;
  return roomOneTimestamp < roomTwoTimestamp ? 1 : roomTwoTimestamp < roomOneTimestamp ? -1 : 0;
}

export default AppStatus;

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
