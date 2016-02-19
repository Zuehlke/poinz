import React from 'react';

const TopBar = ({ room }) => {

  const username = room.getIn(['users', room.get('userId'), 'username']) || '-';

  return (
    <div className='top-bar'>{`${username}@${room.get('roomId')}`}</div>
  );
};


export default TopBar;
