import React from 'react';
import { connect } from 'react-redux';

import RoomJoinForm from '../components/RoomJoinForm';
import RoomHistory from '../components/RoomHistory';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({ roomHistoryLength, waitingForJoin })=> {
  return (
    <div className="landing">
      <div className="landing-inner">
        {!waitingForJoin && <RoomJoinForm />}
        {!waitingForJoin && roomHistoryLength && <RoomHistory />}
        {waitingForJoin && <Loader/>}
      </div>
    </div>
  );
};

Landing.propTypes = {
  waitingForJoin: React.PropTypes.bool,
  roomHistoryLength: React.PropTypes.number
};

export default connect(
  state => ({
    roomHistoryLength: state.get('roomHistory').size,
    waitingForJoin: !!state.get('pendingCommands').find(cmd => cmd.name === 'joinRoom')
  })
)(Landing);

const Loader = () => (
  <div className="eyecatcher loading">
    Loading...
  </div>
);

