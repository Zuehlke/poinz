import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';

import appConfig from '../../services/appConfig';
import {L10nContext} from '../../services/l10n';
import {getAppStatus} from '../../services/restApi/appStatusService';

import {
  StyledPoinzLogo,
  StyledQuickMenuButton,
  StyledTopBar,
  StyledTopBarInner,
  StyledTopLeft,
  StyledTopRight
} from '../TopBar/_styled';
import {StyledAppStatus, StyledAppStatusMain, StyledRoomsList} from './_styled';

/**
 * Our "operations" view. Displays application status (which is fetched from the backend via REST).
 * How many rooms, how many users.
 * Does not display room names, since this page is publicly accessible.
 */
const AppStatus = () => {
  const [appStatus, setAppStatus] = useState();

  const {format} = useContext(L10nContext);

  useEffect(() => {
    loadAndSet();
  }, [format]);

  if (!appStatus) {
    return (
      <StyledAppStatus data-testid="appStatusPage">
        <StyledAppStatusMain>
          <div className="waiting-spinner"></div>
        </StyledAppStatusMain>
      </StyledAppStatus>
    );
  }

  return (
    <StyledAppStatus data-testid="appStatusPage">
      <StyledTopBar data-testid="topBar">
        <StyledTopBarInner>
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
        </StyledTopBarInner>
      </StyledTopBar>

      <StyledAppStatusMain>
        <h2>PoinZ Application Status</h2>

        <p>
          Version: {appConfig.version} {format.formatDateTime(appConfig.buildTime)}
        </p>
        <p>Uptime: {appStatus.uptime}</p>
        <p>Total rooms: {appStatus.roomCount}</p>
        <p>Running on: {appStatus.storeInfo}</p>

        <h3>Rooms</h3>

        <StyledRoomsList>
          <TableHeaders />
          {appStatus.rooms.map((room, index) => (
            <RoomItem key={index} room={room} format={format} />
          ))}
        </StyledRoomsList>
      </StyledAppStatusMain>
    </StyledAppStatus>
  );

  function loadAndSet() {
    if (!format) {
      return; //  L10 not quite ready...
    }

    getAppStatus().then((data) => {
      data.uptime = format.secondsToDaysHoursMinutes(data.uptime);
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

const RoomItem = ({room, format}) => (
  <li>
    <div>{room.userCount}</div>
    <div>{room.userCount - room.userCountDisconnected}</div>
    <div>{room.storyCount}</div>
    <div title={format.formatDateTime(room.created)}>{format.timeAgo(room.created)}</div>
    <div title={format.formatDateTime(room.lastActivity)}>{format.timeAgo(room.lastActivity)}</div>
    <div>{room.markedForDeletion && <i className="icon-circle-empty"></i>}</div>
  </li>
);

RoomItem.propTypes = {
  room: PropTypes.object,
  format: PropTypes.object
};
