import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createRoom } from '../actions';

/**
 * The form on the landing page where the user can create a new room
 */
const CreateRoomForm = ({ t, createRoom }) => (
  <div className="eyecatcher">
    <div className="info-text">
      <i className="fa fa-users leading-paragraph-icon"></i>
      <div>
        <h4>{t('createRoomInfo')}</h4>
        <p>{t('joinRoomInfo')}</p>
      </div>
    </div>
    <button type="button" className="pure-button pure-button-primary" onClick={createRoom}>
      {t('createNewRoom')}
    </button>
  </div>
);

CreateRoomForm.propTypes = {
  t: PropTypes.func,
  createRoom: PropTypes.func
};

export default connect((state) => ({ t: state.translator }), { createRoom })(CreateRoomForm);
