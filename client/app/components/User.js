import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';

import avatarIcons from '../assets/avatars';

const User = ({user, index, moderatorId, selectedStory, ownUserId, cardConfig }) => {

  const isModerator = user.get('id') === moderatorId;
  const isVisitor = user.get('visitor');
  const isDisconnected = user.get('disconnected');
  const revealed = selectedStory && selectedStory.get('allEstimatesGiven');

  const classes = classnames('user user-' + user.get('id'), {
    'user-own': user.get('id') === ownUserId,
    'user-moderator': isModerator,
    'user-visitor': isVisitor,
    'user-disconnected': isDisconnected
  });

  const userEstimationValue = selectedStory && selectedStory.getIn(['estimations', user.get('id')]);
  const userHasEstimation = !_.isUndefined(userEstimationValue); // value could be "0" which is falsy, check for undefined

  const estimationClasses = classnames('user-estimation', {
    'user-estimation-given': userHasEstimation,
    'revealed': revealed
  });

  const matchingCardConfig = cardConfig.find(cc => cc.get('value') === userEstimationValue);
  const estimationValueToDisplay = userHasEstimation && revealed ? matchingCardConfig.get('label') : 'Z';

  const customCardStyle = userHasEstimation && revealed && matchingCardConfig.get('color') ? {
    background: matchingCardConfig.get('color'),
    color: 'white'
  } : {};
  return (
    <div className={classes}>
      {!isDisconnected && isModerator && <span className='moderator-badge'>M</span>}
      {!isDisconnected && isVisitor && <span className='visitor-badge'>V</span>}
      {isDisconnected && <span className='disconnected-badge'>X</span>}
      <img className='avatar' src={avatarIcons[index % avatarIcons.length]}/>
      <div className='user-name'>{user.get('username') || '-'}</div>

      {selectedStory &&
      <div
        className={estimationClasses} style={customCardStyle}>{estimationValueToDisplay}</div>
      }

    </div>
  );

};

export default connect(
  state => ({
    cardConfig: state.get('cardConfig'),
    ownUserId: state.get('userId'),
    moderatorId: state.get('moderatorId'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')])
  }))
(User);
