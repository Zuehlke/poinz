import React, {useState, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import ValidatedInput from '../common/ValidatedInput';
import {EMAIL_REGEX, USERNAME_REGEX} from '../frontendInputValidation';
import avatarIcons from '../../assets/avatars';
import {getOwnUser} from '../../state/users/usersSelectors';
import {toggleExcluded, setUsername, setEmail, setAvatar} from '../../state/actions/commandActions';
import {L10nContext} from '../../services/l10n';

import {
  StyledArea,
  StyledAvatarGrid,
  StyledMiniAvatar,
  StyledRadioButton,
  StyledTextInput
} from './_styled';
import {StyledSection} from '../common/_styled';

const UserSettings = () => {
  const {t, language, setLanguage} = useContext(L10nContext);
  const dispatch = useDispatch();
  const user = useSelector(getOwnUser);
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

  const onMiniAvatarClicked = (index, evt) => {
    if (evt.ctrlKey && evt.altKey) {
      dispatch(setAvatar(-1));
    } else {
      dispatch(setAvatar(index));
    }
  };

  const saveUsername = () => {
    if (myUsername?.length > 2) {
      dispatch(setUsername(myUsername));
    }
  };

  const saveEmail = () => {
    dispatch(setEmail(myEmail));
  };

  const handleToggleExcluded = () => {
    dispatch(toggleExcluded(user.id));
  };

  return (
    <StyledArea>
      <h4>{t('user')}</h4>

      <StyledSection>
        <h5>{t('username')}</h5>

        <StyledTextInput>
          <ValidatedInput
            data-testid="usernameInput"
            type="text"
            autoComplete="name"
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
              $selected={user.avatar === index}
              src={aIcn}
              key={'aIcn_' + aIcn}
              onClick={(evt) => onMiniAvatarClicked(index, evt)}
            />
          ))}
        </StyledAvatarGrid>

        {t('gravatarInfo')}

        <StyledTextInput>
          <ValidatedInput
            data-testid="gravatarEmailInput"
            type="text"
            id="email"
            autoComplete="email"
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
        <h5>{t('spectator')}</h5>
        {t('spectatorInfo')}

        <p
          onClick={handleToggleExcluded}
          className="clickable"
          data-testid="excludedToggle"
        >
          <i className={excluded ? 'icon-check' : 'icon-check-empty'}></i> {t('markSpectator')}
        </p>
      </StyledSection>
    </StyledArea>
  );
};

UserSettings.propTypes = {
  user: PropTypes.object,
  toggleExcluded: PropTypes.func,
  setUsername: PropTypes.func,
  setEmail: PropTypes.func,
  setAvatar: PropTypes.func
};

export default UserSettings;
