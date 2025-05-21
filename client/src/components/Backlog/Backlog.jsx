import React, {useState, useEffect, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useDrag} from 'react-dnd';
import {getEmptyImage} from 'react-dnd-html5-backend';

import {getActiveStories, getTrashedStories} from '../../state/stories/storiesSelectors';
import {getBacklogWidth, isBacklogShown} from '../../state/ui/uiSelectors';
import {setBacklogWidth} from '../../state/actions/uiStateActions';
import {L10nContext} from '../../services/l10n';
import BacklogActive from './BacklogActive';
import BacklogTrash from './BacklogTrash';
import StoryAddForm from './StoryAddForm';
import BacklogModeButtons from './BacklogModeButtons';
import {DEFAULT_BACKLOG_WIDTH} from '../dimensions';
import {DRAG_ITEM_TYPES} from '../Room/Board';

import {StyledBacklog, StyledBacklogWidthDragHandle} from './_styled';

/**
 * The backlog contains two display modes:  active and trash
 * if backlog is active, a form to add new stories and list of all (non-trashed) stories in the room is display
 * if trash is active, only a list of "trashed" stories is displayed
 *
 */
const Backlog = () => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();

  const backlogShown = useSelector(isBacklogShown);
  const backlogWidth = useSelector(getBacklogWidth);
  const trashedStoriesCount = useSelector(state => getTrashedStories(state).length);
  const activeStoriesCount = useSelector(state => getActiveStories(state).length);

  const [showTrash, setShowTrash] = useState(false);

  const handleSetBacklogWidth = (width) => dispatch(setBacklogWidth(width));

  // There is no corresponding drop / useDrop.
  // We just need the dragging functionality, and set the new width of the backlog on "end(...)"
  const [, drag, preview] = useDrag(
    () => ({
      type: DRAG_ITEM_TYPES.backlogWidthHandle,
      end: (item, monitor) => {
        const {x} = monitor.getSourceClientOffset();
        handleSetBacklogWidth(Math.max(DEFAULT_BACKLOG_WIDTH, x + 1));
      }
    }),
    [handleSetBacklogWidth]
  );

  useEffect(() => {
    // make the default drag invisible. See Board.js for the "<BacklogWidthDragLayer />" which we display during drag
    preview(getEmptyImage(), {captureDraggingState: true});
  }, []);

  return (
    <StyledBacklog $shown={backlogShown} data-testid="backlog" $width={backlogWidth}>
      <StyledBacklogWidthDragHandle ref={drag}>
        <div />
        <div />
        <div />
      </StyledBacklogWidthDragHandle>

      <BacklogModeButtons
        t={t}
        onShowBacklog={() => setShowTrash(false)}
        onShowTrash={() => setShowTrash(true)}
        trashShown={showTrash}
        trashedStoriesCount={trashedStoriesCount}
        activeStoriesCount={activeStoriesCount}
      />

      {showTrash && <BacklogTrash />}
      {!showTrash && <StoryAddForm />}
      {!showTrash && <BacklogActive />}
    </StyledBacklog>
  );
};

export default Backlog;
