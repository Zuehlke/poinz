import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {kick, toggleMarkForKick} from '../actions';
import Avatar from './Avatar.js';
import {getCardConfigForValue} from '../services/getCardConfigForValue';

const User = ({user, selectedStory, ownUserId, cardConfig, kick, toggleMarkForKick}) => {
  const isExcluded = user.excluded;
  const isDisconnected = user.disconnected;
  const isMarkedForKick = user.markedForKick;
  const revealed = selectedStory && selectedStory.revealed;

  const classes = classnames('user user-' + user.id, {
    'user-own': user.id === ownUserId,
    'user-excluded': isExcluded,
    'user-disconnected': isDisconnected,
    'user-marked-kick': isMarkedForKick
  });

  const userEstimationValue = selectedStory && selectedStory.estimations[user.id];
  const userHasEstimation = userEstimationValue !== undefined; // value could be "0" which is falsy, check for undefined

  const estimationClasses = classnames('user-estimation', {
    'user-estimation-given': userHasEstimation,
    revealed: revealed
  });

  const matchingCardConfig = getCardConfigForValue(cardConfig, userEstimationValue);
  const estimationValueToDisplay = userHasEstimation && revealed ? matchingCardConfig.label : 'Z';

  const customCardStyle =
    userHasEstimation && revealed && matchingCardConfig.color
      ? {
          background: matchingCardConfig.color,
          color: 'white'
        }
      : {};

  return (
    <div className={classes} onClick={onMarkForKick}>
      {!isDisconnected && isExcluded && (
        <span className="excluded-badge">
          <i className="fa fa-eye"></i>
        </span>
      )}

      {isDisconnected && (
        <span className="disconnected-badge">
          <i className="fa fa-flash"></i>
        </span>
      )}

      <Avatar user={user} />
      <div className="user-name">{user.username || '-'}</div>

      {isMarkedForKick && (
        <span className="kick-overlay">
          <i className="fa fa-sign-out" onClick={() => kick(user.id)}></i>
        </span>
      )}

      {selectedStory && (
        <div className={estimationClasses} style={customCardStyle}>
          {estimationValueToDisplay}
        </div>
      )}
    </div>
  );

  function onMarkForKick() {
    toggleMarkForKick(user.id);
  }
};

User.propTypes = {
  user: PropTypes.object,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  cardConfig: PropTypes.array,
  kick: PropTypes.func.isRequired,
  toggleMarkForKick: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    cardConfig: state.cardConfig,
    ownUserId: state.userId,
    selectedStory: state.stories[state.selectedStory]
  }),
  {kick, toggleMarkForKick}
)(User);
