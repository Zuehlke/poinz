import React from 'react';
import md5 from 'blueimp-md5';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';
import {StyledAvatar} from '../styled/Avatar';

const Avatar = ({user, isOwn, shaded, onClick}) => {
  const avatarImageSource = user.email
    ? createGravatarUrl(user.email)
    : avatarIcons[user.avatar || 0];

  return (
    <StyledAvatar
      className="avatar"
      src={avatarImageSource}
      isOwn={isOwn}
      shaded={shaded}
      onClick={onClick}
    />
  );
};

function createGravatarUrl(email) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?size=60`;
}

Avatar.propTypes = {
  user: PropTypes.object,
  isOwn: PropTypes.bool,
  shaded: PropTypes.bool,
  onClick: PropTypes.func
};

export default Avatar;
