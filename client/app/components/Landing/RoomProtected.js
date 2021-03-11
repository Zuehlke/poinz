import React, {useState, useContext, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {joinRoom} from '../../state/actions/commandActions';
import PasswordField from '../common/PasswordField';
import {
  getJoinFailedAuthRoomId,
  getPendingJoinCommandId
} from '../../state/commandTracking/commandTrackingSelectors';
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
const RoomProtected = ({roomId, pendingJoinCommandId, joinRoom}) => {
  const {t} = useContext(L10nContext);
  const [password, setPassword] = useState('');
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!pendingJoinCommandId) {
      setSpinning(false);
    }
  }, [pendingJoinCommandId]);

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
            {!spinning && (
              <React.Fragment>
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
              </React.Fragment>
            )}

            {spinning && <div className="waiting-spinner"></div>}
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
    setSpinning(true);
    joinRoom(roomId, password);
  }
};

RoomProtected.propTypes = {
  joinRoom: PropTypes.func,
  roomId: PropTypes.string,
  pendingJoinCommandId: PropTypes.string
};

export default connect(
  (state) => ({
    roomId: getJoinFailedAuthRoomId(state),
    pendingJoinCommandId: getPendingJoinCommandId(state)
  }),
  {joinRoom}
)(RoomProtected);
