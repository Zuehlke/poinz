import React from 'react';

const TopBar = ({ room, actions }) => {

  const username = room.getIn(['users', room.get('userId'), 'username']);


  if (username) {
    return (
      <div className='top-bar'>{`${username}@${room.get('roomId')}`}</div>
    );
  } else {

    let usernameInputField;

    return (
      <div className='top-bar'>
        <input type="text" className='username-input' ref={ref => usernameInputField = ref} onKeyPress={handleKeyPress}/>
        {`@${room.get('roomId')}`}
      </div>
    );

    function setUsername() {
      actions.setUsername(usernameInputField.value);
    }

    function handleKeyPress(e) {
      if (e.key === 'Enter') {
        setUsername();
      }
    }
  }
};


export default TopBar;
