import React, {useState, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {L10nContext} from '../../services/l10n';
import {addStory} from '../../state/actions/commandActions';
import {STORY_DESCRIPTION_MAX_LENGTH, STORY_TITLE_REGEX} from '../frontendInputValidation';
import {hasMatchingPendingCommand} from '../../state/commandTracking/commandTrackingSelectors';
import ValidatedInput from '../common/ValidatedInput';

import {StyledAddForm} from './_styled';

/**
 * Form for adding stories to the backlog
 */
const StoryAddForm = () => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();
  const waiting = useSelector(state => hasMatchingPendingCommand(state, 'addStory'));

  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescr, setStoryDescr] = useState('');

  const onDescriptionChange = (ev) => {
    const val = ev.target.value;
    if (val.length <= STORY_DESCRIPTION_MAX_LENGTH) {
      setStoryDescr(val);
    }
  };

  const triggerAddAndClearForm = () => {
    if (storyTitle) {
      dispatch(addStory(storyTitle, storyDescr));
      setStoryTitle('');
      setStoryDescr('');
    }
  };

  return (
    <StyledAddForm
      data-testid="storyAddForm"
      className={`pure-form ${waiting ? 'waiting-spinner' : ''}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className="pure-group">
        <ValidatedInput
          type="text"
          className="pure-input-1"
          placeholder={t('storyTitle')}
          fieldValue={storyTitle}
          setFieldValue={setStoryTitle}
          regexPattern={STORY_TITLE_REGEX}
          onEnter={triggerAddAndClearForm}
        />

        <textarea
          className="pure-input-1"
          rows="1"
          placeholder={t('description')}
          value={storyDescr}
          onChange={onDescriptionChange}
        />
      </fieldset>

      <button
        type="button"
        className="pure-button pure-input-1 pure-button-primary"
        onClick={triggerAddAndClearForm}
      >
        {t('addStory')}
        <i className="icon-plus button-icon-right"></i>
      </button>
    </StyledAddForm>
  );
};

export default StoryAddForm;
