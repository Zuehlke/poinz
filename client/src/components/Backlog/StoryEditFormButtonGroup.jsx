import React from 'react';
import PropTypes from 'prop-types';

import {StyledEditFormButtonGroup} from './_styled';

const StoryEditFormButtonGroup = ({t, onSave, onCancel}) => (
  <StyledEditFormButtonGroup className="pure-g ">
    <div className="pure-u-1-2">
      <button type="button" className="pure-button pure-input-1" onClick={onCancel}>
        {t('cancel')}
        <i className="icon-cancel button-icon-right"></i>
      </button>
    </div>
    <div className="pure-u-1-2">
      <button
        type="button"
        className="pure-button pure-input-1 pure-button-primary"
        onClick={onSave}
        data-testid="saveStoryChangesButton"
      >
        {t('save')}
        <i className="icon-floppy button-icon-right"></i>
      </button>
    </div>
  </StyledEditFormButtonGroup>
);

StoryEditFormButtonGroup.propTypes = {
  t: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

export default StoryEditFormButtonGroup;
