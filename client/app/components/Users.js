import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import User from './User';
import {StyledUsers} from '../styled/Users';

/**
 * The list of users (avatars) and their estimations.
 */
const Users = ({users, ownUserId}) => {
  const userArray = Object.values(users);

  userArray.sort(userComparator.bind(undefined, ownUserId));

  return (
    <StyledUsers data-testid="users">
      {userArray.map((user) => (
        <User key={'usr_' + user.id} user={user} />
      ))}
    </StyledUsers>
  );
};

Users.propTypes = {
  users: PropTypes.object,
  ownUserId: PropTypes.string
};

export default connect((state) => ({
  ownUserId: state.userId,
  users: state.users
}))(Users);

function userComparator(ownUserId, userA, userB) {
  if (userA.id === ownUserId) {
    return -1;
  }
  if (userB.id === ownUserId) {
    return 1;
  }

  if (userA.username && userB.username) {
    return userA.username.localeCompare(userB.username);
  }

  if (userA.username) {
    return -1;
  }
  if (userB.username) {
    return 1;
  }
}
