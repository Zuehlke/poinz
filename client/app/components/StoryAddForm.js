import React from 'react';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';
import {connect} from 'react-redux';

import {addStory} from '../actions';

/**
 * Form for adding stories to the backlog
 */
const StoryAddForm = ({t, addStory, pendingAddCommands}) => {

  const classes = classnames('pure-form story-add-form', {
    'waiting': pendingAddCommands
  });
  let titleInputField, descriptionInputField;

  return (
    <div className={classes}>

      <fieldset className="pure-group">
        <input type="text" className="pure-input-1"
               placeholder={t('storyTitle')}
               ref={ref => titleInputField = ref}
               onKeyPress={handleTitleKeyEvent}/>

        <textarea className="pure-input-1"
                  rows="1"
                  placeholder={t('description')}
                  ref={ref => descriptionInputField = ref}/>
      </fieldset>

      <button type="button"
              className="pure-button pure-input-1 pure-button-primary"
              onClick={triggerAddAndClearForm}>
        {t('addStory')}
        <i className="fa fa-plus  button-icon-right"></i>
      </button>

    </div>
  );

  function handleTitleKeyEvent(keyEvent) {
    if (keyEvent.key === 'Enter') {
      triggerAddAndClearForm();
    }
  }

  function triggerAddAndClearForm() {
    if (titleInputField.value) {
      addStory(titleInputField.value, descriptionInputField.value);
      titleInputField.value = '';
      descriptionInputField.value = '';
    }
  }

};

StoryAddForm.propTypes = {
  t: React.PropTypes.func,
  addStory: React.PropTypes.func,
  pendingAddCommands: React.PropTypes.bool
};

export default connect(
  state => ({
    t: state.get('translator'),
    pendingAddCommands: !!state.get('pendingCommands').find(cmd => cmd.name === 'addStory')
  }),
  dispatch => bindActionCreators({addStory}, dispatch)
)(StoryAddForm);
