import React, {useState, useContext, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {L10nContext} from '../../services/l10n';
import {joinIfReady} from '../../state/actions/commandActions';
import {getPendingJoinCommandId} from '../../state/joining/joiningSelectors';
import PasswordField from '../common/PasswordField';
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
const RoomProtected = () => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();
  const pendingJoinCommandId = useSelector(getPendingJoinCommandId);
  const [password, setPassword] = useState('');
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!pendingJoinCommandId) {
      setSpinning(false);
    }
  }, [pendingJoinCommandId]);

  const onInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      join();
    }
  };

  const onInputChange = (ev) => {
    setPassword(ev.target.value);
  };

  const join = () => {
    setSpinning(true);
    dispatch(joinIfReady({password}));
  };

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
                  autoFocus={true}
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
};

export default RoomProtected;
