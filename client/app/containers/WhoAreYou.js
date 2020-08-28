import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {setUsername} from '../actions';
import GithubRibbon from '../components/GithubRibbon';
import {
  StyledEyecatcher,
  StyledLandingInner,
  StyledLanding,
  StyledInfoText,
  StyledLandingForm
} from '../styled/Landing';

/**
 * Displays a landing page (same styles, zuehlke background) with a username input field.
 * As of issue #14, all users must provide a name, before they can participate in the estimation meeting.
 */
const WhoAreYou = ({t, setUsername}) => {
  const [myUsername, setMyUsername] = useState('');

  return (
    <StyledLanding>
      <GithubRibbon />
      <StyledLandingInner>
        <StyledEyecatcher>
          <StyledInfoText>
            <i className="fa fa-user-secret"></i>
            <p>{t('provideUsernameInfo')}</p>
          </StyledInfoText>
          <StyledLandingForm>
            <input
              data-testid="usernameInput"
              type="text"
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
    const USERNAME_REGEX = /^[-a-zA-Z0-9._*]{1,80}$/;
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
  t: PropTypes.func,
  setUsername: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator
  }),
  {setUsername}
)(WhoAreYou);
