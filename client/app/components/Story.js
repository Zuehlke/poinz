import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {selectStory, editStory, trashStory} from '../actions';
import ConsensusBadge from './ConsensusBadge';
import {getAllMatchingPendingCommands} from '../services/queryPendingCommands';
import {StyledStoryToolbar, StyledStory} from '../styled/Story';
import {StyledStoryTitle} from '../styled/StyledStoryTitle';

/**
 * One story in the backlog
 */
const Story = ({
  story,
  selectedStoryId,
  cardConfig,
  selectStory,
  editStory,
  trashStory,
  pendingSelectCommands,
  pendingTrashCommands
}) => {
  const isSelected = selectedStoryId === story.id;
  const isWaiting =
    pendingSelectCommands.find((cmd) => cmd.payload.storyId === story.id) ||
    pendingTrashCommands.find((cmd) => cmd.payload.storyId === story.id);

  return (
    <StyledStory
      data-testid={isSelected ? 'storySelected' : 'story'}
      onClick={triggerSelect}
      selected={isSelected}
      className={isWaiting ? 'waiting-spinner' : ''}
    >
      <StyledStoryToolbar>
        <i className="fa fa-pencil story-edit" onClick={triggerEdit} />
        <i className="fa fa-trash story-trash" onClick={triggerTrash} />
      </StyledStoryToolbar>

      <StyledStoryTitle>
        <div>{story.title}</div>
        {story.consensus && (
          <ConsensusBadge cardConfig={cardConfig} consensusValue={story.consensus} />
        )}
      </StyledStoryTitle>

      {
        // only display story text for selected story. improves overall readibility / usability (see #24)
        isSelected && (
          <div data-testid="storyText">
            <Anchorify text={story.description} />
          </div>
        )
      }
    </StyledStory>
  );

  function triggerSelect() {
    selectStory(story.id);
  }

  function triggerEdit(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    editStory(story.id);
  }

  function triggerTrash(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    trashStory(story.id);
  }
};

Story.propTypes = {
  story: PropTypes.object,
  cardConfig: PropTypes.array,
  selectedStoryId: PropTypes.string,
  selectStory: PropTypes.func,
  editStory: PropTypes.func,
  trashStory: PropTypes.func,
  pendingSelectCommands: PropTypes.array,
  pendingTrashCommands: PropTypes.array
};

export default connect(
  (state) => ({
    cardConfig: state.cardConfig,
    selectedStoryId: state.selectedStory,
    pendingSelectCommands: getAllMatchingPendingCommands(state, 'selectStory'),
    pendingTrashCommands: getAllMatchingPendingCommands(state, 'trashStory')
  }),
  {selectStory, editStory, trashStory}
)(Story);
