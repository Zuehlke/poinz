import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {joinRoom} from '../actions';

/**
 * List of rooms that the user joined earlier.
 */
const RoomHistory = ({t, roomHistory, joinRoom}) => (
  <div className="eyecatcher room-history">
    {t('joinPrevious')}
    <ol>
      {
        roomHistory.map((room, index) => (
          <li key={index} className="clickable" onClick={() => joinRoom(room)}>
            {room}
          </li>
        ))
      }
    </ol>
  </div>
);

RoomHistory.propTypes = {
  t: React.PropTypes.func,
  roomHistory: React.PropTypes.instanceOf(Immutable.List),
  joinRoom: React.PropTypes.func
};

export default connect(
  state => ({
    t: state.get('translator'),
    roomHistory: state.get('roomHistory')
  }),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomHistory);
