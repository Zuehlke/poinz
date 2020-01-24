import React from 'react';
import classnames from 'classnames';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {kick} from '../actions';
import Avatar from './Avatar.js';

const User = ({user, index, selectedStory, ownUserId, cardConfig, kick}) => {

  const isVisitor = user.visitor;
  const isDisconnected = user.disconnected;
  const revealed = selectedStory && selectedStory.revealed;

  const classes = classnames('user user-' + user.id, {
    'user-own': user.id === ownUserId,
    'user-visitor': isVisitor,
    'user-disconnected': isDisconnected
  });

  const userEstimationValue = selectedStory && selectedStory.estimations[user.id];
  const userHasEstimation = (userEstimationValue !== undefined); // value could be "0" which is falsy, check for undefined

  const estimationClasses = classnames('user-estimation', {
    'user-estimation-given': userHasEstimation,
    'revealed': revealed
  });

  const matchingCardConfig = cardConfig.find(cc => cc.value === userEstimationValue);
  const estimationValueToDisplay = userHasEstimation && revealed ? matchingCardConfig.label : 'Z';

  const customCardStyle = userHasEstimation && revealed && matchingCardConfig.color ? {
    background: matchingCardConfig.color,
    color: 'white'
  } : {};

  return (
    <div className={classes}>
      {
        !isDisconnected && isVisitor &&
        <span className="visitor-badge"><i className="fa fa-eye"></i></span>
      }

      {
        isDisconnected &&
        <span className="disconnected-badge"><i className="fa fa-flash"></i></span>
      }

      <Avatar user={user} index={index}/>
      <div className="user-name">{user.username || '-'}</div>

      {
        isDisconnected &&
        <span onClick={kickUser} className="disconnected-kick-overlay">
          <i className="fa fa-ban"></i>
        </span>
      }

      {selectedStory && <div className={estimationClasses} style={customCardStyle}>{estimationValueToDisplay}</div>}

    </div>
  );

  function kickUser() {
    if (isDisconnected) {
      // is also verified by backend precondition. but we can already test here in order to prevent precondition error
      kick(user.id);
    }
  }

};

User.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedStory: PropTypes.object,
  ownUserId: PropTypes.string,
  cardConfig: PropTypes.array,
  kick: PropTypes.func
};

export default connect(
  state => ({
    cardConfig: state.cardConfig,
    ownUserId: state.userId,
    selectedStory: state.stories[state.selectedStory]
  }),
  dispatch => bindActionCreators({kick}, dispatch)
)(User);
