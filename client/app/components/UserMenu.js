import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { setVisitor, setUsername, leaveRoom } from '../services/actions';
import ActionLog from '../components/ActionLog';

/**
 * The user menu displays a form for changing the username and the vistitor flag.
 *
 * It also displays the ActionLog and a "leave room" button.
 */
const UserMenu = ({user, setUsername, leaveRoom, setVisitor, userMenuShown}) => {

  const username = user.get('username');
  const isVisitor = user.get('visitor');

  const menuClasses = classnames('user-menu', {
    'user-menu-active': userMenuShown
  });

  const visitorCheckboxClasses = classnames('fa', {
    'fa-square-o': !isVisitor,
    'fa-check-square-o': isVisitor
  });

  let usernameInputField;

  return (

    <div className={menuClasses}>

      <div className='pure-form'>
        <h5>Username</h5>

        <div className='username-wrapper'>
          <input type='text'
                 id='username'
                 placeholder='Name...'
                 defaultValue={username}
                 ref={ref => usernameInputField = ref}
                 onKeyPress={handleUsernameKeyPress}/>

          <button className='pure-button pure-button-primary button-save' onClick={saveUsername}>Save</button>
        </div>

        <h5>Mark as Visitor</h5>
        Visitors cannot add, change or estimate stories.

        <p onClick={toggleVisitor} className='clickable'>
          <i className={visitorCheckboxClasses}></i> Visitor
        </p>
      </div>

      <div className='action-log-wrapper'>
        <h5>Log</h5>
        <ActionLog />
      </div>

      <button className='leave-room-button pure-button pure-button-primary' type='button' onClick={leaveRoom}>
        Leave Room
        <i className='fa fa-sign-out button-icon-right'></i>
      </button>
    </div>
  );

  function handleUsernameKeyPress(e) {
    if (e.key === 'Enter') {
      saveUsername();
    }
  }

  function saveUsername() {
    // username length minimum is 2 characters
    if (usernameInputField.value && usernameInputField.value.length > 1) {
      setUsername(usernameInputField.value);
    }
  }

  function toggleVisitor() {
    setVisitor(!isVisitor);
  }

};

UserMenu.propTypes = {
  user: React.PropTypes.instanceOf(Immutable.Map),
  userMenuShown: React.PropTypes.bool,
  setVisitor: React.PropTypes.func,
  leaveRoom: React.PropTypes.func,
  setUsername: React.PropTypes.func
};

export default connect(
  state => ({
    user: state.getIn(['users', state.get('userId')]),
    userMenuShown: state.get('userMenuShown')
  }),
  dispatch => bindActionCreators({
    setVisitor,
    leaveRoom,
    setUsername
  }, dispatch)
)(UserMenu);
