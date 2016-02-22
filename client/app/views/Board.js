import React from 'react';
import { pure } from 'recompose';

import Backlog from '../components/Backlog';
import Users from '../components/Users';
import Estimation from '../components/Estimation';

const Board = ({ room, actions }) => {

  const selectedStory = room.getIn(['stories', room.get('selectedStory')]);

  return (
    <div className='board' id={room.get('roomId')}>
      <Users
        cardConfig={room.get('cardConfig')}
        ownId={room.get('userId')}
        users={room.get('users')}
        moderatorId={room.get('moderatorId')}
        selectedStory={selectedStory}
      />

      <Backlog
        showMenu={room.get('menuShown')}
        actions={actions}
        stories={room.get('stories')}
        selectedStory={room.get('selectedStory')}
      />

      {
        selectedStory &&
        <Estimation
          cardConfig={room.get('cardConfig')}
          moderatorId={room.get('moderatorId')}
          user={room.getIn(['users', room.get('userId')])}
          actions={actions}
          selectedStory={selectedStory}
        />
      }
    </div>
  );
};

export default pure(Board);
