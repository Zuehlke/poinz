import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {setUsername} from '../../state/actions/commandActions';
import {USERNAME_REGEX} from '../frontendInputValidation';
import GithubRibbon from './GithubRibbon';

import {
  StyledEyecatcher,
  StyledLandingInner,
  StyledLanding,
  StyledInfoText,
  StyledLandingForm
} from './_styled';

/**
 * Displays a landing page (same styles, zuehlke background) with a username input field.
 * As of issue #14, all users must provide a name, before they can participate in the estimation meeting.
 */
const WhoAreYou = ({setUsername}) => {
  const {t} = useContext(L10nContext);
  const [myUsername, setMyUsername] = useState('');

  return (
    <StyledLanding>
      <GithubRibbon />
      <StyledLandingInner>
        <StyledEyecatcher>
          <StyledInfoText>
            <i className="icon-user-secret"></i>
            <p>{t('provideUsernameInfo')}</p>
          </StyledInfoText>
          <StyledLandingForm>
            <input
              autoFocus={true}
              data-testid="usernameInput"
              type="text"
              autoComplete="username"
              placeholder={t('name')}
              value={myUsername}
              onChange={onUsernameChange}
              onKeyPress={onUsernameKeyPress}
            />

            <button
              type="button"
              data-testid="joinButton"
              className="pure-button pure-button-primary button-save"
              onClick={saveUsername}
            >
              {t('join')}
            </button>
          </StyledLandingForm>
        </StyledEyecatcher>
      </StyledLandingInner>
    </StyledLanding>
  );

  function onUsernameKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveUsername();
    }
  }

  function onUsernameChange(ev) {
    const usernameValue = ev.target.value;
    if (USERNAME_REGEX.test(usernameValue)) {
      setMyUsername(usernameValue);
    }
  }

  function saveUsername() {
    // username length minimum is 3 characters
    if (myUsername && myUsername.length > 2) {
      setUsername(myUsername);
    }
  }
};

WhoAreYou.propTypes = {
  setUsername: PropTypes.func
};

export default connect(() => ({}), {setUsername})(WhoAreYou);
