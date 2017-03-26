import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {setVisitor, setUsername, setEmail, leaveRoom, setLanguage} from '../actions';

/**
 * The user menu displays a form for changing the username and the vistitor flag.
 *
 * It also dispalys a "leave room" button.
 */
const UserMenu = ({t, language, user, setUsername, setEmail, leaveRoom, setVisitor, setLanguage, userMenuShown}) => {

  const username = user.get('username');
  const email = user.get('email');
  const isVisitor = user.get('visitor');

  const menuClasses = classnames('user-menu', {
    'user-menu-active': userMenuShown
  });

  const visitorCheckboxClasses = classnames('fa', {
    'fa-square-o': !isVisitor,
    'fa-check-square-o': isVisitor
  });

  let usernameInputField, emailInputField;

  return (

    <div className={menuClasses}>

      <div className="pure-form">
        <h5>{t('username')}</h5>

        <div className="username-wrapper">
          <input type="text"
                 id="username"
                 placeholder={t('name')}
                 defaultValue={username}
                 ref={ref => usernameInputField = ref}
                 onKeyPress={handleUsernameKeyPress}/>

          <button className="pure-button pure-button-primary button-save button-save-username"
                  onClick={saveUsername}>{t('save')}</button>
        </div>

        <h5>{t('language')}</h5>
        <div className="language-selector-wrapper">

          <label htmlFor="language-selector-en">
            <input type="radio" id="language-selector-en" name="language-selector"
                   defaultChecked={language === 'en'}
                   onClick={() => setLanguage('en')}
            />
            {t('english')}
          </label>

          <label htmlFor="language-selector-de">
            <input type="radio" id="language-selector-de" name="language-selector"
                   defaultChecked={language === 'de'}
                   onClick={() => setLanguage('de')}
            />
            {t('german')}
          </label>
        </div>

        <h5>{t('gravatar')}</h5>
        {t('gravatarInfo')}

        <div className="email-wrapper">
          <input type="text"
                 id="email"
                 placeholder="Email..."
                 defaultValue={email}
                 ref={ref => emailInputField = ref}
                 onKeyPress={handleEmailKeypress}
          />

          <button className="pure-button pure-button-primary button-save button-save-email"
                  onClick={saveEmail}>{t('save')}</button>
        </div>

        <h5>{t('markVisitor')}</h5>
        {t('visitorInfo')}

        <p onClick={toggleVisitor} className="clickable">
          <i className={visitorCheckboxClasses}></i> {t('visitor')}
        </p>
      </div>

      <button className="leave-room-button pure-button pure-button-primary" type="button" onClick={leaveRoom}>
        {t('leaveRoom')}
        <i className="fa fa-sign-out button-icon-right"></i>
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

  function handleEmailKeypress(e) {
    if (e.key === 'Enter') {
      saveEmail();
    }
  }

  function saveEmail() {
    setEmail(emailInputField.value);
  }

  function toggleVisitor() {
    setVisitor(!isVisitor);
  }

};

UserMenu.propTypes = {
  t: React.PropTypes.func,
  user: React.PropTypes.instanceOf(Immutable.Map),
  userMenuShown: React.PropTypes.bool,
  language: React.PropTypes.string,
  setVisitor: React.PropTypes.func,
  leaveRoom: React.PropTypes.func,
  setLanguage: React.PropTypes.func,
  setUsername: React.PropTypes.func,
  setEmail: React.PropTypes.func
};

export default connect(
  state => ({
    t: state.get('translator'),
    language: state.get('language'),
    user: state.getIn(['users', state.get('userId')]),
    userMenuShown: state.get('userMenuShown')
  }),
  dispatch => bindActionCreators({
    setVisitor,
    leaveRoom,
    setUsername,
    setEmail,
    setLanguage
  }, dispatch)
)(UserMenu);
