import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {showTrash, hideTrash} from '../../actions';
import {getActiveStories, getTrashedStories} from '../../services/selectors';
import BacklogActive from './BacklogActive';
import BacklogTrash from './BacklogTrash';
import StoryAddForm from './StoryAddForm';
import BacklogModeButtons from './BacklogModeButtons';

import {StyledBacklog} from './_styled';

/**
 * The backlog contains two display modes:  active and trash
 * if backlog is active, a form to add new stories and list of all (non-trashed) stories in the room is display
 * if trash is active, only a list of "trashed" stories is displayed
 *
 */
const Backlog = ({
  t,
  backlogShown,
  trashShown,
  showTrash,
  hideTrash,
  trashedStoriesCount,
  activeStoriesCount
}) => {
  return (
    <StyledBacklog shown={backlogShown} data-testid="backlog">
      <BacklogModeButtons
        t={t}
        onShowBacklog={hideTrash}
        onShowTrash={showTrash}
        trashShown={trashShown}
        trashedStoriesCount={trashedStoriesCount}
        activeStoriesCount={activeStoriesCount}
      />

      {trashShown && <BacklogTrash />}
      {!trashShown && <StoryAddForm />}
      {!trashShown && <BacklogActive />}
    </StyledBacklog>
  );
};

Backlog.propTypes = {
  t: PropTypes.func.isRequired,
  backlogShown: PropTypes.bool,
  trashShown: PropTypes.bool,
  showTrash: PropTypes.func.isRequired,
  hideTrash: PropTypes.func.isRequired,
  trashedStoriesCount: PropTypes.number.isRequired,
  activeStoriesCount: PropTypes.number.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    trashShown: state.trashShown,
    backlogShown: state.backlogShown,
    trashedStoriesCount: getTrashedStories(state).length,
    activeStoriesCount: getActiveStories(state).length
  }),
  {showTrash, hideTrash}
)(Backlog);
