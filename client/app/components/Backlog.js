import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import FeedbackHint from './FeedbackHint';

import {showTrash, hideTrash} from '../actions';
import BacklogActive from './BacklogActive';
import BacklogTrash from './BacklogTrash';

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
  const backlogClasses = classnames('backlog', {
    'backlog-active': backlogShown // if true, show menu also in small screens (menu toggle)
  });

  return (
    <div className={backlogClasses}>
      <BacklogModeButtons
        t={t}
        onShowBacklog={hideTrash}
        onShowTrash={showTrash}
        trashShown={trashShown}
        trashedStoriesCount={trashedStoriesCount}
        activeStoriesCount={activeStoriesCount}
      />

      {trashShown && <BacklogTrash />}
      {!trashShown && <BacklogActive />}

      <FeedbackHint />
    </div>
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
    trashedStoriesCount: state.stories
      ? Object.values(state.stories).filter((s) => s.trashed).length
      : 0,
    activeStoriesCount: state.stories
      ? Object.values(state.stories).filter((s) => !s.trashed).length
      : 0
  }),
  {showTrash, hideTrash}
)(Backlog);

const BacklogModeButtons = ({
  t,
  onShowBacklog,
  onShowTrash,
  trashShown,
  trashedStoriesCount,
  activeStoriesCount
}) => (
  <div className="backlog-mode-buttons pure-g">
    <button
      title={t('backlog')}
      type="button"
      className={'pure-u-1-2 pure-button pure-button-stripped ' + (trashShown ? '' : 'active')}
      onClick={onShowBacklog}
    >
      <i className="fa fa-list-ul"></i> {t('backlog')} ({activeStoriesCount})
    </button>
    <button
      title={t('trash')}
      type="button"
      className={'pure-u-1-2 pure-button pure-button-stripped ' + (trashShown ? 'active' : '')}
      onClick={onShowTrash}
    >
      <i className="fa fa-trash"></i> {t('trash')} ({trashedStoriesCount})
    </button>
  </div>
);

BacklogModeButtons.propTypes = {
  t: PropTypes.func.isRequired,
  trashShown: PropTypes.bool,
  onShowBacklog: PropTypes.func.isRequired,
  onShowTrash: PropTypes.func.isRequired,
  trashedStoriesCount: PropTypes.number.isRequired,
  activeStoriesCount: PropTypes.number.isRequired
};
