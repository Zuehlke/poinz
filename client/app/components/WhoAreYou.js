import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setUsername } from '../services/actions';

/**
 * Displays a landing page (same styles, zuehlke background) with a username input field.
 * As of issue #14, all users must provide a name, before they can participate in the estimation meeting.
 */
const WhoAreYou = ({ setUsername }) => {

  let usernameInputField;

  return (
    <div className='landing'>
      <div className='landing-inner'>
        <div className='eyecatcher'>
          <div className='info-text'>
            <i className='fa fa-user-secret leading-paragraph-icon'></i>
            <p>
              Your colleagues would like to know who you are.<br />
              Please provide us with your name.
            </p>
          </div>
          <div className='username-wrapper'>
            <input type='text'
                   id='username'
                   placeholder='Name...'
                   ref={ref => usernameInputField = ref}
                   onKeyPress={handleUsernameKeyPress}/>

            <button className='pure-button pure-button-primary button-save' onClick={saveUsername}>Join</button>
          </div>
        </div>
      </div>
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

};

WhoAreYou.propTypes = {
  setUsername: React.PropTypes.func
};

export default connect(
  undefined,
  dispatch => bindActionCreators({setUsername}, dispatch)
)(WhoAreYou);
