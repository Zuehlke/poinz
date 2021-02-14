import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {restoreStory, deleteStory} from '../../state/actions/commandActions';
import {getTranslator} from '../../state/ui/uiSelectors';
import ValueBadge from '../common/ValueBadge';

import {StyledStoryToolbar, StyledStory} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * One Trashed Story in the Trash
 */
const TrashedStory = ({t, story, restoreStory, deleteStory}) => (
  <StyledStory>
    <StyledStoryToolbar>
      <i
        title={t('restore')}
        className="icon-level-up story-restore"
        onClick={() => restoreStory(story.id)}
        data-testid="restoreStoryButton"
      ></i>
      <i
        title={t('delete')}
        className="icon-minus-circled story-delete"
        onClick={() => deleteStory(story.id)}
        data-testid="deleteStoryButton"
      />
    </StyledStoryToolbar>

    <StyledStoryTitle>
      <div>{story.title}</div>
      {story.consensus && <ValueBadge cardValue={story.consensus} />}
    </StyledStoryTitle>
  </StyledStory>
);

TrashedStory.propTypes = {
  t: PropTypes.func.isRequired,
  story: PropTypes.object,
  restoreStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: getTranslator(state)
  }),
  {restoreStory, deleteStory}
)(TrashedStory);
