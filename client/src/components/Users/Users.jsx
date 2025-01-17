import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import User from './User';
import {getSortedUserArray} from '../../state/users/usersSelectors';

import {StyledUsers} from './_styled';

/**
 * The list of users (avatars) and their estimations.
 */
const Users = ({userArray}) => (
  <StyledUsers data-testid="users">
    {userArray.map((user) => (
      <User key={'usr_' + user.id} user={user} />
    ))}
  </StyledUsers>
);

Users.propTypes = {
  userArray: PropTypes.array
};

export default connect((state) => ({
  userArray: getSortedUserArray(state)
}))(Users);
