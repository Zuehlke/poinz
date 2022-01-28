import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {cancelEditStory} from '../../state/actions/uiStateActions';
import {changeStory} from '../../state/actions/commandActions';
import {STORY_DESCRIPTION_MAX_LENGTH, STORY_TITLE_REGEX} from '../frontendInputValidation';
import {isThisStoryEditFormWaiting} from '../../state/commandTracking/commandTrackingSelectors';
import {getSelectedStoryId} from '../../state/stories/storiesSelectors';
import ValidatedInput from '../common/ValidatedInput';
import StoryEditFormButtonGroup from './StoryEditFormButtonGroup';

import {StyledStory, StyledEditForm} from './_styled';

/**
 * If a story is in "editMode" this form is displayed (in the backlog)
 */
const StoryEditForm = ({story, selectedStoryId, changeStory, cancelEditStory, isWaiting}) => {
  const {t} = useContext(L10nContext);
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
  story: PropTypes.object,
  selectedStoryId: PropTypes.string,
  changeStory: PropTypes.func,
  cancelEditStory: PropTypes.func,
  isWaiting: PropTypes.bool
};

export default connect(
  (state, props) => ({
    selectedStoryId: getSelectedStoryId(state),
    isWaiting: isThisStoryEditFormWaiting(state, props.story.id)
  }),
  {changeStory, cancelEditStory}
)(StoryEditForm);
