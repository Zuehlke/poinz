import React from 'react';
import classnames from 'classnames';
import avatarIcons from '../assets/avatars';
import _ from 'lodash';

const User = ({user, index, cardConfig, ownId, moderatorId, selectedStory}) => {

  const isModerator = user.get('id') === moderatorId;

  const classes = classnames('user user-' + user.get('id'), {
    'user-own': user.get('id') === ownId,
    'user-moderator': isModerator
  });

  const userEstimation = selectedStory && selectedStory.getIn(['estimations', user.get('id')]);

  const estimationClasses = classnames('user-estimation', {
    'user-estimation-given': userEstimation,
    'all-given': selectedStory && selectedStory.get('allEstimatesGiven')
  });

  const estimationValueToDisplay = !_.isUndefined(userEstimation) && selectedStory.get('allEstimatesGiven') ? cardConfig.find(cc => cc.get('value') === userEstimation).get('label') : 'Z';

  return (
    <div className={classes}>
      {isModerator && <span className='moderator-badge'>M</span>}
      <img className='avatar' src={avatarIcons[index % avatarIcons.length]}/>
      <div className='user-name'>{user.get('username') || '-'}</div>
      <div
        className={estimationClasses}>{estimationValueToDisplay}</div>
    </div>
  );

};

const Users = ({ ownId, cardConfig, users, moderatorId, selectedStory }) => (
  <div className='users'>
    {users.toList().map((user, index) => (
      <User
        cardConfig={cardConfig}
        key={user.get('id')}
        index={index}
        user={user}
        ownId={ownId}
        moderatorId={moderatorId}
        selectedStory={selectedStory}
      />
    ))}
  </div>
);


export default Users;
