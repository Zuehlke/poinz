import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {joinRoom} from '../../state/actions/commandActions';
import GithubRibbon from './GithubRibbon';
import PasswordField from '../common/PasswordField';

import {
  StyledEyecatcher,
  StyledLandingInner,
  StyledLanding,
  StyledInfoText,
  StyledLandingForm
} from './_styled';
import {getTranslator} from '../../state/ui/uiSelectors';

/**
 * Displays a landing page (same styles, zuehlke background) with a password input field.
 * If user wants to join a room that is protected by a password
 */
const RoomProtected = ({t, roomId, joinRoom}) => {
  const [password, setPassword] = useState('');

  return (
    <StyledLanding>
      <GithubRibbon />
      <StyledLandingInner>
        <StyledEyecatcher>
          <StyledInfoText>
            <i className="icon-lock"></i>
            <p>{t('roomIsProtected')}</p>
          </StyledInfoText>
          <StyledLandingForm className="pure-form">
            <PasswordField
              placeholder={t('password')}
              onChange={onInputChange}
              value={password}
              onKeyPress={onInputKeyPress}
            />

            <button
              type="button"
              data-testid="joinButton"
              className="pure-button pure-button-primary button-save"
              onClick={join}
            >
              {t('join')}
            </button>
          </StyledLandingForm>
        </StyledEyecatcher>
      </StyledLandingInner>
    </StyledLanding>
  );

  function onInputKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      join();
    }
  }

  function onInputChange(ev) {
    setPassword(ev.target.value);
  }

  function join() {
    joinRoom(roomId, password);
  }
};

RoomProtected.propTypes = {
  t: PropTypes.func,
  joinRoom: PropTypes.func,
  roomId: PropTypes.string
};

export default connect(
  (state) => ({
    t: getTranslator(state),
    roomId: state.users.roomIdJoinAuthFail
  }),
  {joinRoom}
)(RoomProtected);
