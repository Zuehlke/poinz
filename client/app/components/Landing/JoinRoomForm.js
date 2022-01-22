import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {joinRoom} from '../../state/actions/commandActions';
import {ROOM_ID_REGEX} from '../frontendInputValidation';
import {getUsersPresets} from '../../state/users/usersSelectors';
import PasswordField from '../common/PasswordField';
import ValidatedInput from '../common/ValidatedInput';

import {
  StyledEyecatcher,
  StyledInfoText,
  StyledLandingDoubleButtonL,
  StyledLandingDoubleButtonR,
  StyledLandingDoubleButtonWrapper,
  StyledLandingForm
} from './_styled';

/**
 * The form on the landing page where the user can join a room.
 * By default a new room (roomId is randomly generated in the ui).
 * User can optionally set a own roomId "roomName")
 */
const JoinRoomForm = ({presetUsername, joinRoom}) => {
  const {t} = useContext(L10nContext);
  const [showExtended, setShowExtended] = useState(false);
  const [customRoomId, setCustomRoomId] = useState('');
  const [customRoomPassword, setCustomRoomPassword] = useState('');

  return (
    <StyledEyecatcher>
      <StyledInfoText>
        <i className="icon-users"></i>
        <div>
          {presetUsername && (
            <h5>
              {t('welcomeBack')}, {presetUsername}!
            </h5>
          )}
          <h4>{t('joinRoomAndStart')}</h4>
          <p>{t('joinRoomInfo')}</p>
        </div>
      </StyledInfoText>

      <StyledLandingForm className="pure-form">
        <StyledLandingDoubleButtonWrapper>
          <StyledLandingDoubleButtonL
            data-testid="joinButton"
            type="button"
            className=" pure-button pure-button-primary"
            onClick={onTriggerJoin}
          >
            {customRoomId ? t('joinWithRoomName', {room: customRoomId}) : t('joinNewRoom')}
          </StyledLandingDoubleButtonL>

          <StyledLandingDoubleButtonR
            data-testid="extendButton"
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => setShowExtended(!showExtended)}
          >
            <i className={`icon-angle-double-${showExtended ? 'up' : 'down'}`} />
          </StyledLandingDoubleButtonR>
        </StyledLandingDoubleButtonWrapper>

        {showExtended && (
          <React.Fragment>
            <ValidatedInput
              data-testid="customRoomNameInput"
              type="text"
              placeholder={t('customRoomName')}
              fieldValue={customRoomId}
              setFieldValue={setCustomRoomId}
              regexPattern={ROOM_ID_REGEX}
              onEnter={onTriggerJoin}
              allLowercase={true}
              autoComplete="organization"
            />

            <PasswordField
              placeholder={t('optionalPassword')}
              onChange={(evt) => setCustomRoomPassword(evt.target.value)}
              value={customRoomPassword}
              onKeyPress={onPwInputFieldKeyPress}
            />
          </React.Fragment>
        )}
      </StyledLandingForm>
    </StyledEyecatcher>
  );

  function onPwInputFieldKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onTriggerJoin();
    }
  }

  function onTriggerJoin() {
    joinRoom(
      customRoomId ? customRoomId : undefined,
      customRoomPassword ? customRoomPassword : undefined
    );
  }
};

JoinRoomForm.propTypes = {
  presetUsername: PropTypes.string,
  joinRoom: PropTypes.func
};

export default connect(
  (state) => ({
    presetUsername: getUsersPresets(state).username
  }),
  {joinRoom}
)(JoinRoomForm);
