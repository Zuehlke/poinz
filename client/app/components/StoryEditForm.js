import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {changeStory, cancelEditStory} from '../actions';

/**
 * If a story is in "editMode" this form is displayed (in the backlog)
 */
const StoryEditForm = ({story, changeStory, cancelEditStory, pendingChangeCommands}) => {
  const classes = classnames('story', {
    'waiting': pendingChangeCommands.find(cmd => cmd.payload.storyId === story.get('id'))
  });

  let titleInputField, descriptionInputField;

  return (
    <div className={classes}>
      <div className="pure-form">

        <fieldset className="pure-group">
          <input type="text" className="pure-input-1"
                 defaultValue={story.get('title')}
                 ref={ref => titleInputField = ref}
                 onKeyPress={handleTitleKeyEvent}/>

        <textarea className="pure-input-1"
                  rows="1"
                  placeholder="Description / URL / etc."
                  defaultValue={story.get('description')}
                  ref={ref => descriptionInputField = ref}/>
        </fieldset>

        <StoryEditFormButtonGroup
          onSave={triggerChange}
          onCancel={triggerCancel}
        />

      </div>
    </div>
  );

  function handleTitleKeyEvent(keyEvent) {
    if (keyEvent.key === 'Enter') {
      triggerChange();
    }
  }

  function triggerChange() {
    if (titleInputField.value) {
      changeStory(story.get('id'), titleInputField.value, descriptionInputField.value);
    }
  }

  function triggerCancel() {
    cancelEditStory(story.get('id'));
  }
};

StoryEditForm.propTypes = {
  story: React.PropTypes.instanceOf(Immutable.Map),
  changeStory: React.PropTypes.func,
  cancelEditStory: React.PropTypes.func,
  pendingChangeCommands: React.PropTypes.instanceOf(Immutable.Map)
};

export default connect(
  state => ({
    pendingChangeCommands: state.get('pendingCommands').filter(cmd => cmd.name === 'changeStory')
  }),
  dispatch => bindActionCreators({changeStory, cancelEditStory}, dispatch)
)(StoryEditForm);

const StoryEditFormButtonGroup = ({onSave, onCancel}) => (
  <div className="pure-g button-group">
    <div className="pure-u-1-2">
      <button type="button"
              className="pure-button pure-input-1"
              onClick={onCancel}>
        Cancel
        <i className="fa fa-times button-icon-right"></i>
      </button>
    </div>
    <div className="pure-u-1-2">
      <button type="button"
              className="pure-button pure-input-1 pure-button-primary"
              onClick={onSave}>
        Save
        <i className="fa fa-pencil button-icon-right"></i>
      </button>
    </div>
  </div>
);

StoryEditFormButtonGroup.propTypes = {
  onSave: React.PropTypes.func,
  onCancel: React.PropTypes.func
};
