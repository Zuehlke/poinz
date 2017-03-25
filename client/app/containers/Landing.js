import React from 'react';
import {connect} from 'react-redux';

import RoomJoinForm from '../components/RoomJoinForm';
import RoomHistory from '../components/RoomHistory';
import GithubRibbon from '../components/GithubRibbon';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({t, roomHistoryLength, waitingForJoin})=> {
  return (
    <div className="landing">
      <GithubRibbon />
      <div className="landing-inner">
        {!waitingForJoin && <RoomJoinForm />}
        {!waitingForJoin && roomHistoryLength && <RoomHistory />}
        {waitingForJoin && <Loader t={t}/>}
      </div>
    </div>
  );
};

Landing.propTypes = {
  t: React.PropTypes.func,
  waitingForJoin: React.PropTypes.bool,
  roomHistoryLength: React.PropTypes.number
};

export default connect(
  state => ({
    t: state.get('translator'),
    roomHistoryLength: state.get('roomHistory').size,
    waitingForJoin: !!state.get('pendingCommands').find(cmd => cmd.name === 'joinRoom')
  })
)(Landing);

const Loader = ({t}) => (
  <div className="eyecatcher loading">
    {t('loading')}
  </div>
);

Loader.propTypes = {
  t: React.PropTypes.func
};
