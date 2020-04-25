import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Stories from './Stories';
import StoryAddForm from './StoryAddForm';

/**
 * The backlog contains a form to add new stories
 * and a list of stories.
 */
const Backlog = ({ stories, backlogShown, isVisitor }) => {
  const hasStories = stories && !!Object.keys(stories).length;

  const backlogClasses = classnames('backlog', {
    'backlog-active': backlogShown // if true, show menu also in small screens (menu toggle)
  });

  return (
    <div className={backlogClasses}>
      {!isVisitor && <StoryAddForm />}

      {hasStories && <Stories />}
      {!hasStories && (
        <div className="story-hint">
          There are currently no stories in the estimation backlog...
        </div>
      )}
    </div>
  );
};

Backlog.propTypes = {
  stories: PropTypes.object,
  backlogShown: PropTypes.bool,
  isVisitor: PropTypes.bool
};

export default connect((state) => ({
  stories: state.stories,
  backlogShown: state.backlogShown,
  isVisitor: state.users[state.userId] ? state.users[state.userId].visitor : false
}))(Backlog);
