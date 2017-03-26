import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {joinRoom} from '../actions';

/**
 * The form on the landing page where the user can enter a room to join
 */
const RoomJoinForm = ({t, joinRoom}) => {

  let roomIdInputField;

  return (
    <div className="eyecatcher">
      <div className="info-text">
        <i className="fa fa-users leading-paragraph-icon"></i>
        <p>
          {t('enterRoomInfo')}
        </p>
      </div>
      <div className="room-id-wrapper">
        <input placeholder={t('roomName')} type="text" ref={ref => roomIdInputField = ref}
               onKeyPress={handleKeyPress}/>
        <button type="button" className="pure-button pure-button-primary"
                onClick={joinIfRoomIdNotEmpty}>{t('join')}
        </button>
      </div>
    </div>
  );

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      joinIfRoomIdNotEmpty();
    }
  }

  function joinIfRoomIdNotEmpty() {
    if (roomIdInputField.value) {
      joinRoom(roomIdInputField.value);
    }
  }
};

RoomJoinForm.propTypes = {
  t: React.PropTypes.func,
  joinRoom: React.PropTypes.func
};

export default connect(
  state => ({t: state.get('translator')}),
  dispatch => bindActionCreators({joinRoom}, dispatch)
)(RoomJoinForm);
