import React from 'react';
import fecha from 'fecha';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import appConfig from '../services/appConfig';
import {secondsToDaysHoursMinutes} from '../services/timeUtil';
import TopBar from '../components/TopBar';

import {fetchStatus} from '../actions';

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

    const uptime = secondsToDaysHoursMinutes(appStatus.get('uptime'));

    const sortedActiveRooms = appStatus.get('rooms')
      .filter(room => room.get('userCount') > room.get('userCountDisconnected'))
      .sort(roomComparator);

    const sortedInActiveRooms = appStatus.get('rooms')
      .filter(room => room.get('userCount') <= room.get('userCountDisconnected'))
      .sort(roomComparator);

    return (
      <div className="app-status">
        <TopBar />

        <button className="pure-button pure-button-primary" onClick={fetchStatus}>
          <i className="fa fa-refresh"></i>
        </button>

        <h4>PoinZ Application Status</h4>

        <p>
          Version: {appConfig.version} {fecha.format(appConfig.buildTime, ' DD.MM.YY HH:mm')}
        </p>
        <p>
          Uptime: {uptime}
        </p>
        <p>
          Total rooms: {appStatus.get('roomCount')}
        </p>

        <h5>Active Rooms</h5>
        <ul className="rooms rooms-active">
          <TableHeaders />
          {sortedActiveRooms.map((room, index) => <RoomItem key={index} index={index} room={room}/>)}
        </ul>

        <h5>Inactive Rooms</h5>
        <ul className="rooms rooms-active">
          <TableHeaders />
          {sortedInActiveRooms.map((room, index) => <RoomItem key={index} room={room}/>)}
        </ul>


      </div>
    );
  }
}

AppStatus.propTypes = {
  fetchStatus: React.PropTypes.func,
  appStatus: React.PropTypes.instanceOf(Immutable.Map)
};

function roomComparator(rA, rB) {
  const roomOneTimestamp = rA.get('lastActivity');
  const roomTwoTimestamp = rB.get('lastActivity');
  return (roomOneTimestamp < roomTwoTimestamp) ? 1 : roomTwoTimestamp < roomOneTimestamp ? -1 : 0;
}

export default connect(
  state => ({
    appStatus: state.get('appStatus')
  }),
  dispatch => bindActionCreators({fetchStatus}, dispatch)
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
    <div>{room.get('userCount')}</div>
    <div>{room.get('userCountDisconnected')}</div>
    <div>{fecha.format(room.get('created'), 'DD.MM.YYYY HH:mm')}</div>
    <div>{fecha.format(room.get('lastActivity'), 'DD.MM.YYYY HH:mm')}</div>
  </li>
);

RoomItem.propTypes = {
  room: React.PropTypes.instanceOf(Immutable.Map)
};
