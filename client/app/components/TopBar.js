import React from 'react';

const TopBar = ({ room, actions }) => {

  const username = room.getIn(['users', room.get('userId'), 'username']);

  const usernameComponent = username
    ? <span>{username}</span>
    : <input type="text" className='username-input' placeholder='Username...' ref={ref => usernameInputField = ref}
             onKeyPress={handleKeyPress}/>;

  let usernameInputField;

  return (
    <div className='top-bar'>
      <a href='#menu' className='menu-link' onClick={actions.toggleMenu}>
        <span className='menu-link-inner'>
          <span></span>
        </span>
      </a>
      <div className='whoami'>
        {usernameComponent}
        {`@${room.get('roomId')}`}
        <button className="button-small pure-button pure-button-primary" type="button" onClick={actions.leaveRoom}>Leave Room</button>
      </div>
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
};


export default TopBar;


