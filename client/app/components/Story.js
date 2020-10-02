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
  t,
  story,
  selectedStoryId,
  cardConfig,
  selectStory,
  editStory,
  trashStory,
  isWaiting
}) => {
  const isSelected = selectedStoryId === story.id;

  return (
    <StyledStory
      id={'story.' + story.id}
      data-testid={isSelected ? 'storySelected' : 'story'}
      onClick={triggerSelect}
      selected={isSelected}
      className={isWaiting ? 'waiting-spinner' : ''}
    >
      <StyledStoryToolbar>
        <i
          className="icon-pencil story-edit"
          onClick={triggerEdit}
          data-testid="editStoryButton"
          title={t('edit')}
        />
        <i
          className="icon-trash story-trash"
          onClick={triggerTrash}
          data-testid="trashStoryButton"
          title={t('trash')}
        />
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
  isWaiting: PropTypes.bool,
  cardConfig: PropTypes.array,
  selectedStoryId: PropTypes.string,
  selectStory: PropTypes.func,
  editStory: PropTypes.func,
  trashStory: PropTypes.func,
  t: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    cardConfig: state.cardConfig,
    selectedStoryId: state.selectedStory,
    pendingCommands: {
      selectStory: getAllMatchingPendingCommands(state, 'selectStory'),
      trashStory: getAllMatchingPendingCommands(state, 'trashStory')
    }
  }),
  {selectStory, editStory, trashStory},
  (stateProps, dispatchProps, ownProps) => {
    const story = ownProps.story;

    const mergedProps = {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      isWaiting:
        stateProps.pendingCommands.selectStory.find((cmd) => cmd.payload.storyId === story.id) ||
        stateProps.pendingCommands.trashStory.find((cmd) => cmd.payload.storyId === story.id)
    };
    delete mergedProps.pendingCommands;
    return mergedProps;
  }
)(Story);
