import React from 'react';

const Landing = ({ actions, presetUsername })=> {

  let roomIdInputField;

  return (
    <div className='landing'>

      <div className='eyecatcher'>
        <div className="room-id-wrapper">
          <input placeholder='Please enter a room name...' type='text' ref={ref => roomIdInputField = ref}
                 onKeyPress={handleKeyPress}/>
          <button type='button' className='pure-button pure-button-primary' onClick={joinRoom}>Join</button>
        </div>

        <div className='preset-user-name'>{presetUsername}</div>
      </div>

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


export default Landing;
