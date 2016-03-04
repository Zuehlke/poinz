import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { joinRoom } from '../services/actions';

const RoomJoinForm = ({ presetUsername, joinRoom }) => {

  let roomIdInputField;

  return (
    <div className='eyecatcher'>
      <div className='room-id-wrapper'>
        <input placeholder='Please enter a room name...' type='text' ref={ref => roomIdInputField = ref}
               onKeyPress={handleKeyPress}/>
        <button type='button' className='pure-button pure-button-primary'
                onClick={joinIfRoomIdNotEmpty}>Join
        </button>
      </div>
      <div className='preset-user-name'>{presetUsername}</div>
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
  presetUsername: React.PropTypes.string,
  joinRoom: React.PropTypes.func
};

export default connect(
  state => ({
    presetUsername: state.get('presetUsername')
  }),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomJoinForm);
