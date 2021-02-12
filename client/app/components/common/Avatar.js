import React from 'react';
import PropTypes from 'prop-types';

import avatarIcons from '../../assets/avatars';

import {StyledAvatar} from './_styled';

const Avatar = ({user, isOwn, shaded, onClick}) => {
  const avatarImageSource = user.email
    ? `https://www.gravatar.com/avatar/${user.emailHash}?size=60`
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

Avatar.propTypes = {
  user: PropTypes.object,
  isOwn: PropTypes.bool,
  shaded: PropTypes.bool,
  onClick: PropTypes.func
};

export default Avatar;
