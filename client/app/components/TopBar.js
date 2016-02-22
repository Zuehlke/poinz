import React from 'react';
import { pure } from 'recompose';

import UserMenu from './UserMenu';

const TopBar = ({ room, actions }) => {

  const user = room.getIn(['users', room.get('userId')]);

  return (
    <div className='top-bar'>
      <a href='#menu' className='menu-link' onClick={actions.toggleMenu}>
        <span className='menu-link-inner'>
          <span></span>
        </span>
      </a>
      <div className='whoami'>
        <UserMenu
          moderatorId={room.get('moderatorId')}
          user={user}
          roomId={room.get('roomId')}
          actions={actions}
        />
      </div>
    </div>
  );

};


export default pure(TopBar);


