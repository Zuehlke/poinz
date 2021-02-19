import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {joinRoom} from '../../state/actions/commandActions';
import PasswordField from '../common/PasswordField';
import {getJoinFailedAuthRoomId} from '../../state/commandTracking/commandTrackingSelectors';
import GithubRibbon from './GithubRibbon';

import {
  StyledEyecatcher,
  StyledLandingInner,
  StyledLanding,
  StyledInfoText,
  StyledLandingForm
} from './_styled';

/**
 * Displays a landing page (same styles, zuehlke background) with a password input field.
 * If user wants to join a room that is protected by a password
 */
const RoomProtected = ({roomId, joinRoom}) => {
  const {t} = useContext(L10nContext);
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
              data-testid="roomPasswordInput"
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
  joinRoom: PropTypes.func,
  roomId: PropTypes.string
};

export default connect(
  (state) => ({
    roomId: getJoinFailedAuthRoomId(state)
  }),
  {joinRoom}
)(RoomProtected);
