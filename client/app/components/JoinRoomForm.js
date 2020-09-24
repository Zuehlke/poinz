import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ValidatedInput from './ValidatedInput';
import {joinRoom} from '../actions';
import {
  StyledEyecatcher,
  StyledInfoText,
  StyledLandingDoubleButtonL,
  StyledLandingDoubleButtonR,
  StyledLandingForm
} from '../styled/Landing';
import {ROOM_ID_REGEX} from '../services/frontendInputValidation';

/**
 * The form on the landing page where the user can join a room.
 * By default a new room (roomId is randomly generated in the ui).
 * User can optionally set a own roomId "roomName")
 */
const JoinRoomForm = ({t, presetUsername, joinRoom}) => {
  const [showExtended, setShowExtended] = useState(false);
  const [customRoomId, setCustomRoomId] = useState('');

  return (
    <StyledEyecatcher>
      <StyledInfoText>
        <i className="fa fa-users"></i>
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
        <div>
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
            <i className={`fa fa-angle-double-${showExtended ? 'up' : 'down'}`} />
          </StyledLandingDoubleButtonR>
        </div>

        {showExtended && (
          <ValidatedInput
            data-testid="customRoomNameInput"
            type="text"
            placeholder={t('customRoomName')}
            fieldValue={customRoomId}
            setFieldValue={setCustomRoomId}
            regexPattern={ROOM_ID_REGEX}
            onEnter={onTriggerJoin}
            allLowercase={true}
          />
        )}
      </StyledLandingForm>
    </StyledEyecatcher>
  );

  function onTriggerJoin() {
    joinRoom(customRoomId ? customRoomId : undefined);
  }
};

JoinRoomForm.propTypes = {
  t: PropTypes.func,
  presetUsername: PropTypes.string,
  joinRoom: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    presetUsername: state.presetUsername
  }),
  {joinRoom}
)(JoinRoomForm);
