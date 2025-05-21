import React, {useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
import {DRAG_ITEM_TYPES} from '../Room/Board';

import {
  StyledStoryToolbar,
  StyledStory,
  StyledHighlightButtonWrapper,
  StyledStoryAttributes
} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * One story in the (active) backlog.
 */
const Story = ({
  story,
  isHighlighted,
  onStoryClicked,
  dndDragEnd,
  dndMoveStory,
  dndFindStory
}) => {
  const {t, format} = useContext(L10nContext);
  const dispatch = useDispatch();
  
  const selectedStoryId = useSelector(getSelectedStoryId);
  const isWaiting = useSelector(state => isThisStoryWaiting(state, story.id));
  const isStoryEstimated = useSelector(state => isThisStoryEstimated(state, story.id));
  
  const isSelected = selectedStoryId === story.id;
  const hasConsensus = hasStoryConsensus(story);

  const originalIndex = dndFindStory(story.id).index;
  const [{isDragging}, drag] = useDrag(
    () => ({
      type: DRAG_ITEM_TYPES.backlogStory,
      item: () => ({id: story.id, originalIndex}),
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        dndDragEnd(item.id, item.originalIndex, monitor.didDrop());
      }
    }),
    [story.id, originalIndex, dndMoveStory]
  );
  const [, drop] = useDrop(
    () => ({
      accept: DRAG_ITEM_TYPES.backlogStory,
      hover({id: draggedId}) {
        if (draggedId !== story.id) {
          const {index} = dndFindStory(story.id);
          dndMoveStory(draggedId, index, false);
        }
      }
    }),
    [dndFindStory, dndMoveStory]
  );

  const triggerSelect = () => {
    dispatch(selectStory(story.id));
  };

  const triggerEdit = (e) => {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    dispatch(editStory(story.id));
  };

  const triggerTrash = (e) => {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    dispatch(trashStory(story.id));
  };

  return (
    <StyledStory
      ref={(node) => drag(drop(node))}
      id={'story.' + story.id}
      data-testid={isSelected ? 'storySelected' : 'story'}
      onClick={onStoryClicked}
      $selected={isSelected}
      $highlighted={isHighlighted}
      className={isWaiting ? 'waiting-spinner' : ''}
      $isDragging={isDragging}
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
};

Story.propTypes = {
  story: PropTypes.object,
  isHighlighted: PropTypes.bool,
  onStoryClicked: PropTypes.func,
  dndDragEnd: PropTypes.func,
  dndMoveStory: PropTypes.func,
  dndFindStory: PropTypes.func
};

export default Story;
