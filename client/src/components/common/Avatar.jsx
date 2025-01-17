import React from 'react';
import PropTypes from 'prop-types';

import avatarIcons, {SPECIAL} from '../../assets/avatars';

import {StyledAvatar} from './_styled';

const Avatar = ({user, isOwn, shaded, onClick}) => (
  <StyledAvatar
    className="avatar"
    src={getImageSource(user)}
    $isOwn={isOwn}
    $shaded={shaded}
    onClick={onClick}
  />
);

function getImageSource(user) {
  if (user.email) {
    return `https://www.gravatar.com/avatar/${user.emailHash}?size=60`; // the gravatar case
  } else if (user.avatar) {
    return user.avatar === -1 ? SPECIAL : avatarIcons[user.avatar % avatarIcons.length];
  } else {
    return avatarIcons[0];
  }
}

Avatar.propTypes = {
  user: PropTypes.object,
  isOwn: PropTypes.bool,
  shaded: PropTypes.bool,
  onClick: PropTypes.func
};

export default Avatar;
