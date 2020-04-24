import  React from 'react';
import md5 from 'blueimp-md5';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

const Avatar = ({user, index}) => {

  const avatarImageSource = user.email ? createGravatarUrl(user.email) : avatarIcons[index % avatarIcons.length];

  return (
    <img className="avatar" src={avatarImageSource}/>
  );

  function createGravatarUrl(email) {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?size=60`;
  }

};

Avatar.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number
};


export default Avatar;
