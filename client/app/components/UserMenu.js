import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { toggleVisitor, setUsername, leaveRoom } from '../services/actions';
import ActionLog from '../components/ActionLog';

/**
 * This component has own react state.
 * Local state like menuOpen does not belong into our app-state (redux store)
 */
const UserMenu = ({user, setUsername, leaveRoom, toggleVisitor, userMenuShown}) => {

  const username = user.get('username');
  const isVisitor = user.get('visitor');

  const menuClasses = classnames('user-menu', {
    'user-menu-active': userMenuShown
  });

  let usernameInputField;

  return (

    <div className={menuClasses}>

      <div className="pure-form pure-form-stacked">
        <h5>Settings</h5>

        <label htmlFor="username">Username</label>
        <input type="text"
               id="username"
               placeholder="Username..."
               defaultValue={username}
               ref={ref => usernameInputField = ref}
               onKeyPress={handleUsernameKeyPress}/>

        <label htmlFor="visitor">
          <input type="checkbox"
                 id="visitor"
                 defaultChecked={isVisitor}
                 onClick={toggleVisitor}/> Visitor
        </label>
      </div>

      <div className="action-log-wrapper">
        <h5>Log</h5>
        <ActionLog />
      </div>

      <button className="leave-room-button pure-button pure-button-primary" type="button" onClick={leaveRoom}>
        Leave Room
        <i className="fa fa-sign-out"></i>
      </button>
    </div>
  );

  function handleUsernameKeyPress(e) {
    if (e.key === 'Enter') {
      setUsername(usernameInputField.value);
    }
  }
};

export default connect(
  state => ({
    user: state.getIn(['users', state.get('userId')]),
    userMenuShown: state.get('userMenuShown')
  }),
  dispatch => bindActionCreators({
    toggleVisitor,
    leaveRoom,
    setUsername
  }, dispatch)
)(UserMenu);
