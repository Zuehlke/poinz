import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { joinRoom } from '../services/actions';

const RoomJoinForm = ({presetUsername, joinRoom}) => {

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

const RoomJoinFormConnected = connect(
  state => ({
    presetUsername: state.get('presetUsername')
  }),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomJoinForm);

const Loader = () => (
  <div className='eyecatcher loading'>
    Loading...
  </div>
);

const Landing = ({ waitingForJoin })=> {
  return (
    <div className='landing'>
      {!waitingForJoin && <RoomJoinFormConnected />}
      {waitingForJoin && <Loader/>}
    </div>
  );
};


export default connect(
  state => ({
    waitingForJoin: state.get('waitingForJoin')
  })
)(Landing);
