import React from 'react';
import md5 from 'blueimp-md5';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

const Avatar = ({user}) => {
  const avatarImageSource = user.email
    ? createGravatarUrl(user.email)
    : avatarIcons[user.avatar || 0];

  return <img className="avatar" src={avatarImageSource} />;
};

function createGravatarUrl(email) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?size=60`;
}

Avatar.propTypes = {
  user: PropTypes.object
};

export default Avatar;
