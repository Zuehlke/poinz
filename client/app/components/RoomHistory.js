import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * List of rooms that the user joined earlier.
 */
const RoomHistory = ({ t, roomHistory }) => (
  <div className="eyecatcher room-history">
    {t('joinPrevious')}
    <ol>
      {roomHistory.map((room, index) => (
        <li key={index}>
          <a href={'/' + room}>{room}</a>
        </li>
      ))}
    </ol>
  </div>
);

RoomHistory.propTypes = {
  t: PropTypes.func,
  roomHistory: PropTypes.array
};

export default connect((state) => ({
  t: state.translator,
  roomHistory: state.roomHistory
}))(RoomHistory);
