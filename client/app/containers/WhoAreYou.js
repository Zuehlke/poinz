import React from 'react';
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
  let usernameInputField;

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
              type="text"
              placeholder={t('name')}
              ref={(ref) => (usernameInputField = ref)}
              onKeyPress={handleUsernameKeyPress}
            />

            <button className="pure-button pure-button-primary button-save" onClick={saveUsername}>
              {t('join')}
            </button>
          </StyledLandingForm>
        </StyledEyecatcher>
      </StyledLandingInner>
    </StyledLanding>
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
  t: PropTypes.func,
  setUsername: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator
  }),
  {setUsername}
)(WhoAreYou);
