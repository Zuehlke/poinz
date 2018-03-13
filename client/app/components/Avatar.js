import React from 'react';
import md5 from 'blueimp-md5';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

const Avatar = ({user, index}) => {

  const email = user.get('email');
  const avatarImageSource = email ? createGravatarUrl(email) : avatarIcons[index % avatarIcons.length];

  return (
    <img className="avatar" src={avatarImageSource}/>
  );

  function createGravatarUrl(email) {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?size=60`;
  }

};

Avatar.propTypes = {
  user: PropTypes.instanceOf(Immutable.Map),
  index: PropTypes.number
};


export default Avatar;
