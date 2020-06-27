import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

import {toggleExcluded, setUsername, setEmail, leaveRoom, setLanguage, setAvatar} from '../actions';

/**
 * The user menu allows customizing Poinz
 * - changing the username, avatar
 * - changing language
 */
const UserMenu = ({
  t,
  language,
  user,
  setUsername,
  setEmail,
  setAvatar,
  toggleExcluded,
  setLanguage,
  userMenuShown
}) => {
  const username = user.username;
  const email = user.email;
  const excluded = user.excluded;

  const menuClasses = classnames('user-menu', {
    'user-menu-active': userMenuShown
  });

  const excludedCheckboxClasses = classnames('fa', {
    'fa-square-o': !excluded,
    'fa-check-square-o': excluded
  });

  let usernameInputField, emailInputField;

  return (
    <div className={menuClasses}>
      <div className="pure-form">
        <div className="user-menu-section">
          <h5>{t('username')}</h5>

          <div className="username-wrapper">
            <input
              type="text"
              id="username"
              placeholder={t('name')}
              defaultValue={username}
              ref={(ref) => (usernameInputField = ref)}
              onKeyPress={handleUsernameKeyPress}
            />

            <button
              className="pure-button pure-button-primary button-save button-save-username"
              onClick={saveUsername}
            >
              <i className="fa fa-save" />
            </button>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('language')}</h5>
          <div className="language-selector-wrapper">
            <label htmlFor="language-selector-en">
              <input
                type="radio"
                id="language-selector-en"
                name="language-selector"
                defaultChecked={language === 'en'}
                onClick={() => setLanguage('en')}
              />
              {t('english')}
            </label>

            <label htmlFor="language-selector-de">
              <input
                type="radio"
                id="language-selector-de"
                name="language-selector"
                defaultChecked={language === 'de'}
                onClick={() => setLanguage('de')}
              />
              {t('german')}
            </label>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('avatar')}</h5>
          {t('avatarInfo')}

          <div className="avatar-grid">
            {avatarIcons.map((aIcn, index) => (
              <img
                className={user.avatar === index ? 'selected' : ''}
                src={aIcn}
                key={'aIcn_' + aIcn}
                onClick={() => setAvatar(index)}
              />
            ))}
          </div>

          {t('gravatarInfo')}

          <div className="email-wrapper">
            <input
              type="text"
              id="email"
              placeholder="Email..."
              defaultValue={email}
              ref={(ref) => (emailInputField = ref)}
              onKeyPress={handleEmailKeypress}
            />

            <button
              className="pure-button pure-button-primary button-save button-save-email"
              onClick={saveEmail}
            >
              <i className="fa fa-save" />
            </button>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('markExcluded')}</h5>
          {t('excludedInfo')}

          <p onClick={toggleExcluded} className="clickable">
            <i className={excludedCheckboxClasses}></i> {t('excluded')}
          </p>
        </div>
      </div>

      <div className="license-hint">
        Avatar Icons (c) by DELEKET{' '}
        <a href="https://www.deviantart.com/deleket">https://www.deviantart.com/deleket</a>
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

  function handleEmailKeypress(e) {
    if (e.key === 'Enter') {
      saveEmail();
    }
  }

  function saveEmail() {
    setEmail(emailInputField.value);
  }
};

UserMenu.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  userMenuShown: PropTypes.bool,
  language: PropTypes.string,
  toggleExcluded: PropTypes.func,
  leaveRoom: PropTypes.func,
  setLanguage: PropTypes.func,
  setUsername: PropTypes.func,
  setAvatar: PropTypes.func,
  setEmail: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    language: state.language,
    user: state.users[state.userId],
    userMenuShown: state.userMenuShown
  }),
  {
    toggleExcluded,
    leaveRoom,
    setUsername,
    setEmail,
    setAvatar,
    setLanguage
  }
)(UserMenu);
