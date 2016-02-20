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

  const userEstimationValue = selectedStory && selectedStory.getIn(['estimations', user.get('id')]);
  const userHasEstimation = !_.isUndefined(userEstimationValue); // value could be "0" which is falsy, check for undefined

  const estimationClasses = classnames('user-estimation', {
    'user-estimation-given': userHasEstimation,
    'all-given': selectedStory && selectedStory.get('allEstimatesGiven')
  });

  const estimationValueToDisplay = userHasEstimation && selectedStory.get('allEstimatesGiven') ? cardConfig.find(cc => cc.get('value') === userEstimationValue).get('label') : 'Z';

  return (
    <div className={classes}>
      {isModerator && <span className='moderator-badge'>M</span>}
      <img className='avatar' src={avatarIcons[index % avatarIcons.length]}/>
      <div className='user-name'>{user.get('username') || '-'}</div>

      {selectedStory &&
      <div
        className={estimationClasses}>{estimationValueToDisplay}</div>
      }
    </div>
  );

};

export default User;
