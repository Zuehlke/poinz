import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

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
  t: PropTypes.func,
  roomHistory: PropTypes.array,
  joinRoom: PropTypes.func
};

export default connect(
  state => ({
    t: state.translator,
    roomHistory: state.roomHistory
  }),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomHistory);
