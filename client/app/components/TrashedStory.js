import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ConsensusBadge from './ConsensusBadge';
import {restoreStory, deleteStory} from '../actions';
import {StyledStoryToolbar, StyledStory} from '../styled/Story';

/**
 * One Trashed Story in the Trash
 */
const TrashedStory = ({t, story, cardConfig, restoreStory, deleteStory}) => {
  return (
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

      <h4>
        <div>{story.title}</div>
        {story.consensus && (
          <ConsensusBadge cardConfig={cardConfig} consensusValue={story.consensus} />
        )}
      </h4>
    </StyledStory>
  );
};

TrashedStory.propTypes = {
  t: PropTypes.func.isRequired,
  story: PropTypes.object,
  cardConfig: PropTypes.array,
  restoreStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    cardConfig: state.cardConfig
  }),
  {restoreStory, deleteStory}
)(TrashedStory);
