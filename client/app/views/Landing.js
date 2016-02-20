import React from 'react';


const RoomJoinForm = ({actions, presetUsername}) => {

  let roomIdInputField;

  return (
    <div className='eyecatcher'>
      <div className="room-id-wrapper">
        <input placeholder='Please enter a room name...' type='text' ref={ref => roomIdInputField = ref}
               onKeyPress={handleKeyPress}/>
        <button type='button' className='pure-button pure-button-primary' onClick={joinRoom}>Join</button>
      </div>
      <div className='preset-user-name'>{presetUsername}</div>
    </div>
  );

  function joinRoom() {
    actions.joinRoom(roomIdInputField.value);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      joinRoom();
    }
  }
};

const Loader = () => (
  <div className='eyecatcher loading'>
    Loading...
  </div>
);

const Landing = ({ actions, presetUsername, waitingForJoin })=> {
  return (
    <div className='landing'>
      {!waitingForJoin && <RoomJoinForm actions={actions} presetUsername={presetUsername}/>}
      {waitingForJoin && <Loader/>}
    </div>
  );
};


export default Landing;
