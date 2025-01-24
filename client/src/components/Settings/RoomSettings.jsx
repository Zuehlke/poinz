import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {SIDEBAR_SETTINGS} from '../../state/actions/uiStateActions';
import {
  setCardConfig,
  setPassword,
  setRoomConfigToggleConfidence,
  setRoomConfigToggleAutoReveal,
  setRoomConfigIssueTrackingUrl
} from '../../state/actions/commandActions';
import PasswordField from '../common/PasswordField';
import RoomExportFileDownload from './RoomExportFileDownload';
import {getCardConfigInOrder, getRoomId} from '../../state/room/roomSelectors';
import {getCurrentSidebarIfAny} from '../../state/ui/uiSelectors';
import {CardConfigEditor} from './CardConfigEditor';

import {StyledExpandButton, StyledArea, StyledTextInput} from './_styled';
import {StyledSection} from '../common/_styled';

const RoomSettings = ({
  shown,
  autoReveal,
  withConfidence,
  issueTrackingUrl,
  cardConfig,
  roomId,
  setCardConfig,
  setPassword,
  setRoomConfigToggleConfidence,
  setRoomConfigToggleAutoReveal,
  setRoomConfigIssueTrackingUrl,
  passwordProtected
}) => {
  const {t} = useContext(L10nContext);

  const [customCardConfigExpanded, setCustomCardConfigExpanded] = useState(true);
  React.useEffect(() => {
    setCustomCardConfigExpanded(true);
  }, [shown]);

  const [myRoomPassword, setMyRoomPassword] = useState(''); // we never [can] pre-set the pw.
  const [myRoomPasswordRepeat, setMyRoomPasswordRepeat] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  React.useEffect(() => {
    setMyRoomPassword('');
    setMyRoomPasswordRepeat('');
  }, [passwordProtected]);

  React.useEffect(() => {
    setPasswordsMatch(
      myRoomPasswordRepeat === myRoomPassword && myRoomPassword && myRoomPassword.length
    );
  }, [myRoomPassword, myRoomPasswordRepeat]);

  // derive issueTrackingUrl for input field from prop
  const [myIssueTrackingUrl, setMyIssueTrackingUrl] = useState(issueTrackingUrl || '');
  React.useEffect(() => {
    setMyIssueTrackingUrl(issueTrackingUrl || '');
  }, [issueTrackingUrl]);

  return (
    <StyledArea>
      <h4>{t('room')}</h4>

      <StyledSection>
        <h5>{t('toggleAutoReveal')}</h5>
        {t('autoRevealInfo')}

        <p
          onClick={setRoomConfigToggleAutoReveal}
          className="clickable"
          data-testid="toggleAutoReveal"
        >
          <i className={autoReveal ? 'icon-check' : 'icon-check-empty'}></i> {t('autoReveal')}
        </p>
      </StyledSection>

      <StyledSection data-testid="sectionPasswordProtection">
        <h5>
          {t('passwordProtection')} {!passwordProtected && <i className="icon-lock-open-alt"></i>}{' '}
          {passwordProtected && <i className="icon-lock"></i>}
        </h5>
        {t('passwordProtectionInfo')}

        <div>
          {passwordProtected && <p>{t('roomIsProtected')}</p>}
          {!passwordProtected && <p>{t('roomIsNotProtected')}</p>}
          <StyledTextInput>
            <PasswordField
              data-testid="roomPasswordInput"
              onKeyPress={onRoomPasswordKeyPress}
              onChange={(e) => setMyRoomPassword(e.target.value)}
              value={myRoomPassword}
              placeholder={t('setNewPassword')}
              isNewPassword={true}
            />
          </StyledTextInput>
          <StyledTextInput>
            <PasswordField
              data-testid="roomPasswordInputRepeat"
              onKeyPress={onRoomPasswordKeyPress}
              onChange={(e) => setMyRoomPasswordRepeat(e.target.value)}
              value={myRoomPasswordRepeat}
              placeholder={t('repeatNewPassword')}
              isNewPassword={true}
            />
          </StyledTextInput>

          <button
            data-testid="savePasswordButton"
            className="pure-button pure-button-primary"
            onClick={savePassword}
            disabled={!passwordsMatch}
          >
            <i className="icon-floppy" />
          </button>

          {passwordProtected && (
            <button
              data-testid="clearPasswordButton"
              className="pure-button"
              onClick={clearPassword}
            >
              {t('removePassword')}
              <i className="icon-ccw button-icon-right" />
            </button>
          )}
        </div>
      </StyledSection>

      <StyledSection>
        <h5>{t('confidence')}</h5>
        {t('confidenceInfo')}

        <p
          onClick={setRoomConfigToggleConfidence}
          className="clickable"
          data-testid="toggleConfidence"
        >
          <i className={withConfidence ? 'icon-check' : 'icon-check-empty'}></i>{' '}
          {t('toggleConfidence')}
        </p>
      </StyledSection>

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
          <CardConfigEditor t={t} cardConfig={cardConfig} onSave={(cc) => setCardConfig(cc)} />
        )}
      </StyledSection>

      <StyledSection>
        <h5>{t('issueTrackingUrl')}</h5>
        {t('issueTrackingUrlInfo')}

        <StyledTextInput>
          <input
            data-testid="issueTrackingUrlInput"
            type="text"
            autoComplete="url"
            id="issueTrackingUrl"
            placeholder={t('issueTrackingUrlExample')}
            value={myIssueTrackingUrl}
            onChange={(e) => setMyIssueTrackingUrl(e.target.value)}
            onKeyPress={onIssueTrackingUrlKeyPress}
          />

          <button
            data-testid="setIssueTrackingUrlButton"
            className="pure-button pure-button-primary"
            onClick={() => setRoomConfigIssueTrackingUrl(myIssueTrackingUrl)}
          >
            <i className="icon-floppy" />
          </button>
        </StyledTextInput>
      </StyledSection>

      <StyledSection>
        <h5>{t('export')}</h5>
        {t('exportInfo')}

        <p>
          <RoomExportFileDownload roomId={roomId} />
        </p>
      </StyledSection>
    </StyledArea>
  );

  function onRoomPasswordKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      savePassword();
    }
  }

  function savePassword() {
    if (passwordsMatch) {
      setPassword(myRoomPassword);
    }
  }

  function clearPassword() {
    setPassword('');
  }

  function onIssueTrackingUrlKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setRoomConfigIssueTrackingUrl(myIssueTrackingUrl);
    }
  }
};

RoomSettings.propTypes = {
  shown: PropTypes.bool,
  autoReveal: PropTypes.bool,
  withConfidence: PropTypes.bool,
  issueTrackingUrl: PropTypes.string,
  setCardConfig: PropTypes.func,
  setPassword: PropTypes.func,
  setRoomConfigToggleConfidence: PropTypes.func,
  setRoomConfigToggleAutoReveal: PropTypes.func,
  setRoomConfigIssueTrackingUrl: PropTypes.func,
  cardConfig: PropTypes.array,
  roomId: PropTypes.string,
  passwordProtected: PropTypes.bool
};

export default connect(
  (state) => ({
    shown: getCurrentSidebarIfAny(state) === SIDEBAR_SETTINGS,
    autoReveal: state.room.autoReveal,
    withConfidence: state.room.withConfidence,
    issueTrackingUrl: state.room.issueTrackingUrl,
    cardConfig: getCardConfigInOrder(state),
    roomId: getRoomId(state),
    passwordProtected: state.room.passwordProtected
  }),
  {
    setCardConfig,
    setPassword,
    setRoomConfigToggleConfidence,
    setRoomConfigToggleAutoReveal,
    setRoomConfigIssueTrackingUrl
  }
)(RoomSettings);
