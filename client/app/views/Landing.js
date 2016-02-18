import React from 'react';

const Landing = ({ actions })=> {

  let roomIdInputField;

  return (
    <div className='landing'>

      <div className='eyecatcher'>
        <div className="room-id-wrapper">
          <input placeholder='room' type='text' ref={ref => roomIdInputField = ref} onKeyPress={handleKeyPress}/>
          <button type='button' className='pure-button pure-button-primary' onClick={joinRoom}>Start</button>
        </div>
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
