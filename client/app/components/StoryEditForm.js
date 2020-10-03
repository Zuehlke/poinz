import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {changeStory, cancelEditStory} from '../actions';
import {isThisStoryEditFormWaiting} from '../services/selectors';
import {StyledStory} from '../styled/Story';
import {StyledEditFormButtonGroup, StyledEditForm} from '../styled/Backlog';
import ValidatedInput from './ValidatedInput';
import {STORY_DESCRIPTION_MAX_LENGTH, STORY_TITLE_REGEX} from '../services/frontendInputValidation';

/**
 * If a story is in "editMode" this form is displayed (in the backlog)
 */
const StoryEditForm = ({t, story, selectedStoryId, changeStory, cancelEditStory, isWaiting}) => {
  const isSelected = selectedStoryId === story.id;

  const [storyTitle, setStoryTitle] = useState(story.title);
  const [storyDescr, setStoryDescr] = useState(story.description);

  return (
    <StyledStory
      noShadow={true}
      className={isWaiting ? 'waiting-spinner' : ''}
      data-testid={isSelected ? 'storySelected' : 'story'}
    >
      <StyledEditForm className="pure-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="pure-group">
          <ValidatedInput
            type="text"
            className="pure-input-1"
            fieldValue={storyTitle}
            setFieldValue={setStoryTitle}
            regexPattern={STORY_TITLE_REGEX}
            onEnter={triggerChange}
          />

          <textarea
            className="pure-input-1"
            rows="1"
            placeholder={t('description')}
            value={storyDescr}
            onChange={onDescriptionChange}
          />
        </fieldset>

        <StoryEditFormButtonGroup t={t} onSave={triggerChange} onCancel={triggerCancel} />
      </StyledEditForm>
    </StyledStory>
  );

  function onDescriptionChange(ev) {
    const val = ev.target.value;
    if (val.length <= STORY_DESCRIPTION_MAX_LENGTH) {
      setStoryDescr(val);
    }
  }

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
  isWaiting: PropTypes.bool
};

export default connect(
  (state, props) => ({
    t: state.translator,
    selectedStoryId: state.selectedStory,
    isWaiting: isThisStoryEditFormWaiting(state, props.story.id)
  }),
  {changeStory, cancelEditStory}
)(StoryEditForm);

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
