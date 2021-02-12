import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ValidatedInput from '../common/ValidatedInput';
import {EMAIL_REGEX, USERNAME_REGEX} from '../frontendInputValidation';
import avatarIcons from '../../assets/avatars';

import {setLanguage} from '../../state/actions/uiStateActions';
import {toggleExcluded, setUsername, setEmail, setAvatar} from '../../state/actions/commandActions';

import {
  StyledArea,
  StyledAvatarGrid,
  StyledMiniAvatar,
  StyledRadioButton,
  StyledSection,
  StyledTextInput
} from './_styled';

const UserSettings = ({
  t,
  language,
  user,
  setUsername,
  setEmail,
  setAvatar,
  toggleExcluded,
  setLanguage
}) => {
  const {username, email, excluded} = user;

  // derive username for input field from prop
  const [myUsername, setMyUsername] = useState(username || '');
  React.useEffect(() => {
    setMyUsername(user.username || '');
  }, [user.username]);

  // derive email for input field from prop
  const [myEmail, setMyEmail] = useState(email || '');
  React.useEffect(() => {
    setMyEmail(user.email || '');
  }, [user.email]);

  return (
    <StyledArea>
      <h4>{t('user')}</h4>

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
            <i className="icon-floppy" />
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
            <i className="icon-floppy" />
          </button>
        </StyledTextInput>
      </StyledSection>

      <StyledSection>
        <h5>{t('markExcluded')}</h5>
        {t('excludedInfo')}

        <p onClick={toggleExcluded} className="clickable" data-testid="excludedToggle">
          <i className={excluded ? 'icon-check' : 'icon-check-empty'}></i> {t('excluded')}
        </p>
      </StyledSection>
    </StyledArea>
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

UserSettings.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  language: PropTypes.string,
  toggleExcluded: PropTypes.func,
  setUsername: PropTypes.func,
  setEmail: PropTypes.func,
  setAvatar: PropTypes.func,
  setLanguage: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    user: state.users[state.userId],
    language: state.language
  }),
  {
    toggleExcluded,
    setUsername,
    setEmail,
    setAvatar,
    setLanguage
  }
)(UserSettings);
