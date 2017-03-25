import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';

import User from './User';

/**
 * The list of users (avatars) and their estimations.
 */
const Users = ({users}) => (
  <div className="users">
    {users.toList().map((user, index) => (
      <User
        key={user.get('id')}
        index={index}
        user={user}
      />
    ))}
  </div>
);

Users.propTypes = {
  users: React.PropTypes.instanceOf(Immutable.Map)
};

export default connect(
  state => ({
    users: state.get('users')
  })
)(Users);
