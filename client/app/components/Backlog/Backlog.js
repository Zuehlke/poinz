import React, {useState, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getActiveStories, getTrashedStories} from '../../state/stories/storiesSelectors';
import {isBacklogShown} from '../../state/ui/uiSelectors';
import {L10nContext} from '../../services/l10n';
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
const Backlog = ({backlogShown, trashedStoriesCount, activeStoriesCount}) => {
  const {t} = useContext(L10nContext);
  // whether to show trash (list of trashed stories) or not. by default this is false, i.e. the active stories are shown
  const [showTrash, setShowTrash] = useState(false);

  return (
    <StyledBacklog shown={backlogShown} data-testid="backlog">
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

Backlog.propTypes = {
  backlogShown: PropTypes.bool,
  trashedStoriesCount: PropTypes.number.isRequired,
  activeStoriesCount: PropTypes.number.isRequired
};

export default connect((state) => ({
  backlogShown: isBacklogShown(state),
  trashedStoriesCount: getTrashedStories(state).length,
  activeStoriesCount: getActiveStories(state).length
}))(Backlog);
