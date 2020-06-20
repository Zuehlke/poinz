import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import User from './User';

/**
 * The list of users (avatars) and their estimations.
 */
const Users = ({users, ownUserId}) => {
  const userArray = Object.values(users);
  userArray.sort((uOne, uTwo) => (uOne.id === ownUserId ? -1 : uTwo.id === ownUserId ? 1 : 0));

  return (
    <div className="users">
      {userArray.map((user, index) => (
        <User key={user.id} index={index} user={user} />
      ))}
    </div>
  );
};

Users.propTypes = {
  users: PropTypes.object,
  ownUserId: PropTypes.string
};

export default connect((state) => ({
  users: state.users,
  ownUserId: state.userId
}))(Users);
