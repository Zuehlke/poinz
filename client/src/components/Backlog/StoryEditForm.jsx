import React, {useState, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
const StoryEditForm = ({story}) => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();

  const selectedStoryId = useSelector(getSelectedStoryId);
  const isWaiting = useSelector(state => isThisStoryEditFormWaiting(state, story.id));
  const isSelected = selectedStoryId === story.id;

  const [storyTitle, setStoryTitle] = useState(story.title);
  const [storyDescr, setStoryDescr] = useState(story.description);

  const onDescriptionChange = (ev) => {
    const val = ev.target.value;
    if (val.length <= STORY_DESCRIPTION_MAX_LENGTH) {
      setStoryDescr(val);
    }
  };

  const triggerChange = () => {
    if (storyTitle) {
      dispatch(changeStory(story.id, storyTitle, storyDescr ? storyDescr : ''));
    }
  };

  const triggerCancel = () => {
    dispatch(cancelEditStory(story.id));
  };

  return (
    <StyledStory
      $noShadow={true}
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
};

StoryEditForm.propTypes = {
  story: PropTypes.object
};

export default StoryEditForm;
