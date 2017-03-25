import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import classnames from 'classnames';

import Stories from './Stories';
import StoryAddForm from './StoryAddForm';

/**
 * The backlog contains a form to add new stories
 * and a list of stories.
 */
const Backlog = ({stories, backlogShown, isVisitor}) => {

  const hasStories = stories && !!stories.size;

  const backlogClasses = classnames('backlog', {
    'backlog-active': backlogShown // if true, show menu also in small screens (menu toggle)
  });

  return (
    <div className={backlogClasses}>

      {!isVisitor && <StoryAddForm />}

      {hasStories && <Stories />}
      {!hasStories && <div className="story-hint">There are currently no stories in the estimation backlog...</div>}

    </div>
  );
};

Backlog.propTypes = {
  stories: React.PropTypes.instanceOf(Immutable.Map),
  backlogShown: React.PropTypes.bool,
  isVisitor: React.PropTypes.bool
};

export default connect(
  state => ({
    stories: state.get('stories'),
    backlogShown: state.get('backlogShown'),
    isVisitor: state.getIn(['users', state.get('userId'), 'visitor'])
  })
)(Backlog);
