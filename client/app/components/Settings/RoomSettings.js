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

import {StyledSection, StyledExpandButton, StyledArea, StyledTextInput} from './_styled';

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

  const [customCardConfigExpanded, setCustomCardConfigExpanded] = useState(false);
  React.useEffect(() => {
    setCustomCardConfigExpanded(false);
  }, [shown]);

  const [myRoomPassword, setMyRoomPassword] = useState(''); // we never [can] pre-set the pw.
  React.useEffect(() => {
    setMyRoomPassword('');
  }, [passwordProtected]);

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

        {passwordProtected && (
          <div>
            <p>{t('roomIsProtected')}</p>
            <StyledTextInput>
              <PasswordField
                data-testid="roomPasswordInput"
                onKeyPress={onRoomPasswordKeyPress}
                onChange={(e) => setMyRoomPassword(e.target.value)}
                value={myRoomPassword}
                placeholder={t('setNewPassword')}
                isNewPassword={true}
              />

              <button
                data-testid="savePasswordButton"
                className="pure-button pure-button-primary"
                onClick={savePassword}
              >
                <i className="icon-floppy" />
              </button>
            </StyledTextInput>
          </div>
        )}

        {!passwordProtected && (
          <div>
            <p>{t('roomIsNotProtected')}</p>
            <StyledTextInput>
              <PasswordField
                data-testid="roomPasswordInput"
                onKeyPress={onRoomPasswordKeyPress}
                onChange={(e) => setMyRoomPassword(e.target.value)}
                value={myRoomPassword}
                placeholder={t('setNewPassword')}
                isNewPassword={true}
              />

              <button
                data-testid="savePasswordButton"
                className="pure-button pure-button-primary"
                onClick={savePassword}
              >
                <i className="icon-floppy" />
              </button>
            </StyledTextInput>
          </div>
        )}
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
    setPassword(myRoomPassword);
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
