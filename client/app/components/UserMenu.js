import React, {useState} from 'react';
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
import ValidatedInput from './ValidatedInput';

const USERNAME_REGEX = /^[-a-zA-Z0-9._*]{0,80}$/;
const EMAIL_REGEX = /^[-a-zA-Z0-9._@*]{0,245}$/; // do not check for correct/valid email regex here. this regex gets validated after every keypress

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

  const [myUsername, setMyUsername] = useState(username);
  const [myEmail, setMyEmail] = useState(email || '');

  return (
    <StyledUserMenu shown={userMenuShown} data-testid="userMenu">
      <div className="pure-form">
        <StyledSection>
          <h5>{t('username')}</h5>

          <StyledTextInput>
            <ValidatedInput
              data-testid="usernameInput"
              type="text"
              id="username"
              placeholder={t('name')}
              fieldValue={myUsername}
              setFieldValue={setMyUsername}
              regexPattern={USERNAME_REGEX}
              onEnter={saveUsername}
            />

            <button
              data-testid="saveUsernameButton"
              className="pure-button pure-button-primary"
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

          <StyledAvatarGrid data-testid="avatarGrid">
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
            <ValidatedInput
              data-testid="gravatarEmailInput"
              type="text"
              id="email"
              placeholder="Email..."
              fieldValue={myEmail}
              setFieldValue={setMyEmail}
              regexPattern={EMAIL_REGEX}
              onEnter={saveEmail}
            />

            <button
              className="pure-button pure-button-primary"
              onClick={saveEmail}
              data-testid="saveEmailButton"
            >
              <i className="fa fa-save" />
            </button>
          </StyledTextInput>
        </StyledSection>

        <StyledSection>
          <h5>{t('markExcluded')}</h5>
          {t('excludedInfo')}

          <p onClick={toggleExcluded} className="clickable" data-testid="excludedToggle">
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

  function saveUsername() {
    if (myUsername && myUsername.length) {
      setUsername(myUsername);
    }
  }

  function saveEmail() {
    setEmail(myEmail);
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
