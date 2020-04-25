import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import User from './User';

/**
 * The list of users (avatars) and their estimations.
 */
const Users = ({ users }) => (
  <div className="users">
    {Object.values(users).map((user, index) => (
      <User key={user.id} index={index} user={user} />
    ))}
  </div>
);

Users.propTypes = {
  users: PropTypes.object
};

export default connect((state) => ({
  users: state.users
}))(Users);
