import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';
import {isUndefined} from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {kick} from '../actions';

import Avatar from './Avatar.js';

const User = ({user, index, selectedStory, ownUserId, cardConfig, kick}) => {

  const isVisitor = user.get('visitor');
  const isDisconnected = user.get('disconnected');
  const revealed = selectedStory && selectedStory.get('revealed');

  const classes = classnames('user user-' + user.get('id'), {
    'user-own': user.get('id') === ownUserId,
    'user-visitor': isVisitor,
    'user-disconnected': isDisconnected
  });

  const userEstimationValue = selectedStory && selectedStory.getIn(['estimations', user.get('id')]);
  const userHasEstimation = !isUndefined(userEstimationValue); // value could be "0" which is falsy, check for undefined

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
      {
        !isDisconnected && isVisitor &&
        <span className="visitor-badge"><i className="fa fa-eye"></i></span>
      }

      {
        isDisconnected &&
        <span className="disconnected-badge"><i className="fa fa-flash"></i></span>
      }

      <Avatar user={user} index={index}/>
      <div className="user-name">{user.get('username') || '-'}</div>

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
      kick(user.get('id'));
    }
  }

};

User.propTypes = {
  user: React.PropTypes.instanceOf(Immutable.Map),
  index: React.PropTypes.number,
  selectedStory: React.PropTypes.instanceOf(Immutable.Map),
  ownUserId: React.PropTypes.string,
  cardConfig: React.PropTypes.instanceOf(Immutable.List),
  kick: React.PropTypes.func
};

export default connect(
  state => ({
    cardConfig: state.get('cardConfig'),
    ownUserId: state.get('userId'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')])
  }),
  dispatch => bindActionCreators({kick}, dispatch)
)(User);
