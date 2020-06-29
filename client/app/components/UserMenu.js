import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

import {toggleExcluded, setUsername, setEmail, leaveRoom, setLanguage, setAvatar} from '../actions';
import {
  StyledAvatarGrid,
  StyledLicenseHint,
  StyledRadioButton,
  StyledTextInput,
  StyledSection,
  StyledUserMenu,
  StyledMiniAvatar
} from '../styled/UserMenu';

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

  let usernameInputField, emailInputField;

  return (
    <StyledUserMenu shown={userMenuShown}>
      <div className="pure-form">
        <StyledSection>
          <h5>{t('username')}</h5>

          <StyledTextInput>
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
          </StyledTextInput>
        </StyledSection>

        <StyledSection>
          <h5>{t('language')}</h5>
          <StyledRadioButton>
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
          </StyledRadioButton>
        </StyledSection>

        <StyledSection>
          <h5>{t('avatar')}</h5>
          {t('avatarInfo')}

          <StyledAvatarGrid>
            {avatarIcons.map((aIcn, index) => (
              <StyledMiniAvatar
                selected={user.avatar === index}
                src={aIcn}
                key={'aIcn_' + aIcn}
                onClick={() => setAvatar(index)}
              />
            ))}
          </StyledAvatarGrid>

          {t('gravatarInfo')}

          <StyledTextInput>
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
          </StyledTextInput>
        </StyledSection>

        <StyledSection>
          <h5>{t('markExcluded')}</h5>
          {t('excludedInfo')}

          <p onClick={toggleExcluded} className="clickable">
            <i className={'fa ' + (excluded ? 'fa-check-square-o' : 'fa-square-o')}></i>{' '}
            {t('excluded')}
          </p>
        </StyledSection>
      </div>

      <StyledLicenseHint>
        Avatar Icons (c) by DELEKET{' '}
        <a href="https://www.deviantart.com/deleket">https://www.deviantart.com/deleket</a>
      </StyledLicenseHint>
    </StyledUserMenu>
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
