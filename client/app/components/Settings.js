import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import avatarIcons from '../assets/avatars';

import {
  toggleExcluded,
  setUsername,
  setEmail,
  leaveRoom,
  setLanguage,
  setAvatar,
  setCardConfig
} from '../actions';
import {
  StyledAvatarGrid,
  StyledLicenseHint,
  StyledRadioButton,
  StyledTextInput,
  StyledSection,
  StyledSettings,
  StyledMiniAvatar,
  StyledLinkButton,
  StyledTextarea,
  StyledExpandButton,
  ErrorMsg,
  StyledArea
} from '../styled/Settings';
import ValidatedInput from './ValidatedInput';
import {EMAIL_REGEX, USERNAME_REGEX} from '../services/frontendInputValidation';

/**
 * The user menu allows customizing Poinz
 * - changing the username, avatar
 * - changing language
 */
const Settings = ({
  t,
  language,
  user,
  setUsername,
  setEmail,
  setAvatar,
  toggleExcluded,
  setLanguage,
  settingsShown,
  cardConfig,
  setCardConfig,
  roomId
}) => {
  const username = user.username;
  const email = user.email;
  const excluded = user.excluded;

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

  // derive custom card config for textarea   from prop
  const [customCardConfigString, setCustomCardConfigString] = useState(
    JSON.stringify(cardConfig, null, 4)
  );
  React.useEffect(() => {
    setCustomCardConfigString(JSON.stringify(cardConfig, null, 4));
  }, [cardConfig]);
  const [customCardConfigExpanded, setCustomCardConfigExpanded] = useState(false);
  React.useEffect(() => {
    setCustomCardConfigExpanded(false);
  }, [settingsShown]);
  const [customCardConfigJsonError, setCustomCardConfigJsonError] = useState(false);

  return (
    <StyledSettings shown={settingsShown} data-testid="settings">
      <div className="pure-form">
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

        <StyledArea>
          <h4>{t('room')}</h4>

          <StyledSection>
            <h5>{t('customCards')}</h5>
            {t('customCardsInfo')}

            {!customCardConfigExpanded && (
              <StyledExpandButton
                type="button"
                className="pure-button pure-button-primary"
                onClick={() => setCustomCardConfigExpanded(true)}
              >
                <i className="icon-angle-double-down"></i>
              </StyledExpandButton>
            )}

            {customCardConfigExpanded && (
              <div>
                <p>
                  <StyledTextarea
                    value={customCardConfigString}
                    onChange={(e) => setCustomCardConfigString(e.target.value)}
                  ></StyledTextarea>
                </p>
                {customCardConfigJsonError && <ErrorMsg>{t('customCardsJsonError')}</ErrorMsg>}
                <p>
                  <button
                    type="button"
                    className="pure-button pure-button-primary"
                    onClick={setCustomCardConfiguration}
                  >
                    {t('iKnowWhatImDoin')} <i className="icon-floppy" />
                  </button>
                </p>
              </div>
            )}
          </StyledSection>

          <StyledSection>
            <h5>{t('export')}</h5>
            {t('exportInfo')}

            <p>
              <StyledLinkButton href={`/api/room/${roomId}?mode=file`} download>
                {t('exportLinkText')} <i className="icon-download-cloud"></i>
              </StyledLinkButton>
            </p>
          </StyledSection>
        </StyledArea>
      </div>

      <StyledLicenseHint>
        Avatar Icons (c) by DELEKET{' '}
        <a href="https://www.deviantart.com/deleket">https://www.deviantart.com/deleket</a>
      </StyledLicenseHint>
    </StyledSettings>
  );

  function saveUsername() {
    if (myUsername && myUsername.length) {
      setUsername(myUsername);
    }
  }

  function saveEmail() {
    setEmail(myEmail);
  }

  function setCustomCardConfiguration() {
    try {
      const customCc = JSON.parse(customCardConfigString);
      setCustomCardConfigJsonError(false);
      setCardConfig(customCc);
    } catch (e) {
      setCustomCardConfigJsonError(true);
    }
  }
};

Settings.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  settingsShown: PropTypes.bool,
  language: PropTypes.string,
  toggleExcluded: PropTypes.func,
  leaveRoom: PropTypes.func,
  setLanguage: PropTypes.func,
  setUsername: PropTypes.func,
  setAvatar: PropTypes.func,
  setCardConfig: PropTypes.func,
  setEmail: PropTypes.func,
  cardConfig: PropTypes.array,
  roomId: PropTypes.string
};

export default connect(
  (state) => ({
    t: state.translator,
    cardConfig: state.cardConfig,
    language: state.language,
    user: state.users[state.userId],
    settingsShown: state.settingsShown,
    roomId: state.roomId
  }),
  {
    toggleExcluded,
    leaveRoom,
    setUsername,
    setEmail,
    setAvatar,
    setLanguage,
    setCardConfig
  }
)(Settings);
