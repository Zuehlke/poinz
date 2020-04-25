import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Room from './Room';
import WhoAreYou from './WhoAreYou';
import AppStatus from './AppStatus';
import Landing from './Landing';

import { joinRoom } from '../actions';

/**
 * The Main component decides whether to display the landing page or the poinz estimation board (a room).
 * If the user did never set his username/name in a previous session, display "whoAreYou" with a username input field.
 * If the selected room matches the special id "poinzstatus" an app status view is displayed. (does not contain private data).
 */
class Main extends React.Component {
  componentDidMount() {
    // if our url already contains a pathname, request room for that value
    const roomIdFromUrl = location.pathname ? location.pathname.substr(1) : '';
    if (roomIdFromUrl) {
      this.props.joinRoom(roomIdFromUrl);
    }
  }

  render() {
    const { roomId, users, presetUsername } = this.props;
    const hasRoomIdAndUsers = roomId && users && Object.keys(users).length > 0;

    if (roomId === 'poinzstatus') {
      return <AppStatus />;
    } else if (hasRoomIdAndUsers && presetUsername) {
      return <Room />;
    } else if (hasRoomIdAndUsers) {
      return <WhoAreYou />;
    } else {
      return <Landing />;
    }
  }
}

Main.propTypes = {
  joinRoom: PropTypes.func,
  roomId: PropTypes.string,
  users: PropTypes.object,
  presetUsername: PropTypes.string
};

export default connect(
  (state) => ({
    roomId: state.roomId,
    users: state.users,
    presetUsername: state.presetUsername
  }),
  { joinRoom }
)(Main);
