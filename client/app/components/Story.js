import React from 'react';
import {connect} from 'react-redux';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {selectStory, editStory, trashStory} from '../actions';
import ConsensusBadge from './ConsensusBadge';
import {isThisStoryWaiting} from '../services/selectors';
import {StyledStoryToolbar, StyledStory, StyledStoryText, StyledStoryTitle} from '../styled/Story';

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
  const hasConsensus = story.consensus !== undefined && story.consensus !== null; // value could be "0" which is falsy, check for undefined

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
        {hasConsensus && (
          <ConsensusBadge cardConfig={cardConfig} consensusValue={story.consensus} />
        )}
      </StyledStoryTitle>

      {
        // only display story text for selected story. improves overall readibility / usability (see #24)
        isSelected && (
          <StyledStoryText data-testid="storyText">
            <Anchorify text={story.description || ''} />
          </StyledStoryText>
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
  (state, props) => ({
    t: state.translator,
    cardConfig: state.cardConfig,
    selectedStoryId: state.selectedStory,
    isWaiting: isThisStoryWaiting(state, props.story.id)
  }),
  {selectStory, editStory, trashStory}
)(Story);
