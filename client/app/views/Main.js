import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Landing from './Landing';
import Board from './Board';
import TopBar from '../components/TopBar';

import { joinRoom } from '../services/actions';

class Main extends React.Component {

  componentDidMount() {
    // if our url already contains a pathname, request room for that value
    const roomIdFromUrl = location.pathname ? location.pathname.substr(1) : '';
    if (roomIdFromUrl) {
      this.props.joinRoom(roomIdFromUrl);
    }
  }

  render() {

    const { roomId, users } = this.props;

    if (roomId && users && users.size > 0) {
      return (
        <div style={{height:'100%'}}>
          <TopBar />
          <Board />
          <div className='version-info'>
            {__POINZ_CONFIG__.version}
          </div>
        </div>
      );
    } else {
      return (
        <Landing  />
      );
    }
  }
}

Main.propTypes = {
  joinRoom: React.PropTypes.func,
  roomId: React.PropTypes.string,
  users: React.PropTypes.instanceOf(Immutable.Map),
  presetUsername: React.PropTypes.string,
  waitingForJoin: React.PropTypes.bool
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    users: state.get('users'),
    presetUsername: state.get('presetUsername'),
    waitingForJoin: state.get('waitingForJoin')
  }),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(Main);
