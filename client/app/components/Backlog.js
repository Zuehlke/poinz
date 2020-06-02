import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Stories from './Stories';
import StoryAddForm from './StoryAddForm';
import Avatar from './Avatar';

/**
 * The backlog contains a form to add new stories
 * and a list of stories.
 */
const Backlog = ({stories, backlogShown}) => {
  const hasStories = stories && !!Object.keys(stories).length;

  const backlogClasses = classnames('backlog', {
    'backlog-active': backlogShown // if true, show menu also in small screens (menu toggle)
  });

  return (
    <div className={backlogClasses}>
      <StoryAddForm />

      {hasStories && <Stories />}
      {!hasStories && (
        <div className="story-hint">
          There are currently no stories in the estimation backlog...
        </div>
      )}

      <div className="feedback-hint">
        <Avatar user={{email: 'set@zuehlke.com'}} index={0} />
        <span>
          Hey there! Do you use Poinz on a regular basis? I would be very interested in your{' '}
          <a
            href="https://github.com/Zuehlke/poinz/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            feedback!
          </a>
        </span>
      </div>
    </div>
  );
};

Backlog.propTypes = {
  stories: PropTypes.object,
  backlogShown: PropTypes.bool
};

export default connect((state) => ({
  stories: state.stories,
  backlogShown: state.backlogShown
}))(Backlog);
