import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {changeStory, cancelEditStory} from '../actions';
import {getAllMatchingPendingCommands} from '../services/queryPendingCommands';
import {StyledStory} from '../styled/Story';
import {StyledEditFormButtonGroup, StyledEditForm} from '../styled/Backlog';
import ValidatedInput from './ValidatedInput';
import ValidatedTextarea from './ValidatedTextarea';

const REGEX_STORY_TITLE = /^.{0,100}$/;
const REGEX_STORY_DESCR = /^.{0,2000}$/;

/**
 * If a story is in "editMode" this form is displayed (in the backlog)
 */
const StoryEditForm = ({
  t,
  story,
  selectedStoryId,
  changeStory,
  cancelEditStory,
  pendingChangeCommands
}) => {
  const isSelected = selectedStoryId === story.id;
  const waiting = pendingChangeCommands.find((cmd) => cmd.payload.storyId === story.id);

  const [storyTitle, setStoryTitle] = useState(story.title);
  const [storyDescr, setStoryDescr] = useState(story.description);

  return (
    <StyledStory
      noShadow={true}
      className={waiting ? 'waiting-spinner' : ''}
      data-testid={isSelected ? 'storySelected' : 'story'}
    >
      <StyledEditForm className="pure-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="pure-group">
          <ValidatedInput
            type="text"
            className="pure-input-1"
            fieldValue={storyTitle}
            setFieldValue={setStoryTitle}
            regexPattern={REGEX_STORY_TITLE}
            onEnter={triggerChange}
          />

          <ValidatedTextarea
            className="pure-input-1"
            rows="1"
            placeholder={t('description')}
            fieldValue={storyDescr}
            setFieldValue={setStoryDescr}
            regexPattern={REGEX_STORY_DESCR}
          />
        </fieldset>

        <StoryEditFormButtonGroup t={t} onSave={triggerChange} onCancel={triggerCancel} />
      </StyledEditForm>
    </StyledStory>
  );

  function triggerChange() {
    if (storyTitle) {
      changeStory(story.id, storyTitle, storyDescr ? storyDescr : '');
    }
  }

  function triggerCancel() {
    cancelEditStory(story.id);
  }
};

StoryEditForm.propTypes = {
  t: PropTypes.func.isRequired,
  story: PropTypes.object,
  selectedStoryId: PropTypes.string,
  changeStory: PropTypes.func,
  cancelEditStory: PropTypes.func,
  pendingChangeCommands: PropTypes.array
};

export default connect(
  (state) => ({
    t: state.translator,
    selectedStoryId: state.selectedStory,
    pendingChangeCommands: getAllMatchingPendingCommands(state, 'changeStory')
  }),
  {changeStory, cancelEditStory}
)(StoryEditForm);

const StoryEditFormButtonGroup = ({t, onSave, onCancel}) => (
  <StyledEditFormButtonGroup className="pure-g ">
    <div className="pure-u-1-2">
      <button type="button" className="pure-button pure-input-1" onClick={onCancel}>
        {t('cancel')}
        <i className="fa fa-times button-icon-right"></i>
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
        <i className="fa fa-save button-icon-right"></i>
      </button>
    </div>
  </StyledEditFormButtonGroup>
);

StoryEditFormButtonGroup.propTypes = {
  t: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};
