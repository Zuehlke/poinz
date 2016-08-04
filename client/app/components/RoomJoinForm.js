import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { joinRoom } from '../services/actions';

/**
 * The form on the landing page where the user can enter a room to join
 */
const RoomJoinForm = ({joinRoom }) => {

  let roomIdInputField;

  return (
    <div className="eyecatcher">
      <div className="info-text">
        <i className="fa fa-users leading-paragraph-icon"></i>
        <p>
          Please enter the name of the room<br /> you'd like to join.
        </p>
      </div>
      <div className="room-id-wrapper">
        <input placeholder="Room name..." type="text" ref={ref => roomIdInputField = ref}
               onKeyPress={handleKeyPress}/>
        <button type="button" className="pure-button pure-button-primary"
                onClick={joinIfRoomIdNotEmpty}>Join
        </button>
      </div>
    </div>
  );

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      joinIfRoomIdNotEmpty();
    }
  }

  function joinIfRoomIdNotEmpty() {
    if (roomIdInputField.value) {
      joinRoom(roomIdInputField.value);
    }
  }
};

RoomJoinForm.propTypes = {
  joinRoom: React.PropTypes.func
};

export default connect(
  undefined,
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomJoinForm);
