import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {SIDEBAR_SETTINGS} from '../../state/actions/uiStateActions';
import {
  toggleAutoReveal,
  toggleConfidence,
  setCardConfig,
  setPassword
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
  cardConfig,
  roomId,
  setCardConfig,
  toggleAutoReveal,
  toggleConfidence,
  setPassword,
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

  return (
    <StyledArea>
      <h4>{t('room')}</h4>

      <StyledSection>
        <h5>{t('toggleAutoReveal')}</h5>
        {t('autoRevealInfo')}

        <p onClick={toggleAutoReveal} className="clickable" data-testid="toggleAutoReveal">
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

        <p onClick={toggleConfidence} className="clickable" data-testid="toggleConfidence">
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
};

RoomSettings.propTypes = {
  shown: PropTypes.bool,
  autoReveal: PropTypes.bool,
  withConfidence: PropTypes.bool,
  toggleAutoReveal: PropTypes.func,
  toggleConfidence: PropTypes.func,
  setCardConfig: PropTypes.func,
  setPassword: PropTypes.func,
  cardConfig: PropTypes.array,
  roomId: PropTypes.string,
  passwordProtected: PropTypes.bool
};

export default connect(
  (state) => ({
    shown: getCurrentSidebarIfAny(state) === SIDEBAR_SETTINGS,
    autoReveal: state.room.autoReveal,
    withConfidence: state.room.withConfidence,
    cardConfig: getCardConfigInOrder(state),
    roomId: getRoomId(state),
    passwordProtected: state.room.passwordProtected
  }),
  {
    toggleAutoReveal,
    toggleConfidence,
    setCardConfig,
    setPassword
  }
)(RoomSettings);
