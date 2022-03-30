import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDrag, useDrop} from 'react-dnd';

import {L10nContext} from '../../services/l10n';
import {getSelectedStoryId, hasStoryConsensus} from '../../state/stories/storiesSelectors';
import {isThisStoryEstimated} from '../../state/estimations/estimationsSelectors';
import {editStory} from '../../state/actions/uiStateActions';
import {selectStory, trashStory} from '../../state/actions/commandActions';
import {isThisStoryWaiting} from '../../state/commandTracking/commandTrackingSelectors';
import ValueBadge from '../common/ValueBadge';
import UndecidedBadge from '../common/UndecidedBadge';
import StoryDescription from '../common/StoryDescription';

import {
  StyledStoryToolbar,
  StyledStory,
  StyledHighlightButtonWrapper,
  StyledStoryAttributes
} from './_styled';
import {StyledStoryTitle} from '../_styled';
import {DnDItemTypes} from '../Room/Board';

/**
 * One story in the (active) backlog.
 */
const Story = ({
  story,
  isHighlighted,
  onStoryClicked,
  selectedStoryId,
  selectStory,
  editStory,
  trashStory,
  isWaiting,
  isStoryEstimated,
  onStoryDragHover,
  onStoryDragDropped
}) => {
  const {t, format} = useContext(L10nContext);
  const isSelected = selectedStoryId === story.id;
  const hasConsensus = hasStoryConsensus(story);

  const [{isDragging}, drag] = useDrag(
    () => ({
      type: DnDItemTypes.BACKLOG_STORY,
      item: {id: story.id},
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [story.id]
  );

  const [, drop] = useDrop(() => ({
    accept: DnDItemTypes.BACKLOG_STORY,
    drop: (item) => {
      console.log('dropped story ', item.id, 'on', story.id);
      onStoryDragDropped(item.id, story.id);
    },
    hover: (item) => {
      if (item.id !== story.id) {
        onStoryDragHover(item.id, story.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <StyledStory
      ref={(node) => drag(drop(node))}
      id={'story.' + story.id}
      data-testid={isSelected ? 'storySelected' : 'story'}
      onClick={onStoryClicked}
      selected={isSelected}
      highlighted={isHighlighted}
      className={isWaiting ? 'waiting-spinner' : ''}
      isDragging={isDragging}
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
        {hasConsensus && <ValueBadge cardValue={story.consensus} />}
        {!hasConsensus && isStoryEstimated && story.revealed && <UndecidedBadge />}
      </StyledStoryTitle>

      {
        // only display story text and creation date for highlighted story. Improves overall readability / usability (see #24)
        isHighlighted && (
          <React.Fragment>
            <StoryDescription
              storyId={story.id}
              text={story.description}
              showMarkdownToggle={false}
              scroll={false}
              textExpandThreshold={100}
            />
            <StyledHighlightButtonWrapper>
              <StyledStoryAttributes>
                <span>{format.formatDateTime(story.createdAt)}</span>
              </StyledStoryAttributes>

              {
                // if not the currently selected story, display "Estimate" Button
                !isSelected && (
                  <button
                    type="button"
                    className="pure-button pure-button-primary"
                    data-testid="selectButton"
                    onClick={triggerSelect}
                    title={t('estimateStoryHint')}
                  >
                    {t('estimateStory')} <i className="icon-right-hand button-icon-right"></i>
                  </button>
                )
              }
            </StyledHighlightButtonWrapper>
          </React.Fragment>
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
  isHighlighted: PropTypes.bool,
  isStoryEstimated: PropTypes.bool,
  selectedStoryId: PropTypes.string,
  onStoryClicked: PropTypes.func,
  selectStory: PropTypes.func,
  editStory: PropTypes.func,
  trashStory: PropTypes.func,
  onStoryDragHover: PropTypes.func,
  onStoryDragDropped: PropTypes.func
};

export default connect(
  (state, props) => ({
    selectedStoryId: getSelectedStoryId(state),
    isWaiting: isThisStoryWaiting(state, props.story.id),
    isStoryEstimated: isThisStoryEstimated(state, props.story.id)
  }),
  {selectStory, editStory, trashStory}
)(Story);
