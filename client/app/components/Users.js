import React from 'react';
import User from './User';

const Users = ({ ownId, cardConfig, users, moderatorId, selectedStory }) => (
  <div className='users'>
    {users.toList().map((user, index) => (
      <User
        cardConfig={cardConfig}
        key={user.get('id')}
        index={index}
        user={user}
        ownId={ownId}
        moderatorId={moderatorId}
        selectedStory={selectedStory}
      />
    ))}
  </div>
);


export default Users;
