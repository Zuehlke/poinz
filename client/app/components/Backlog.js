import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Stories from './Stories';
import StoryAddForm from './StoryAddForm';

const Backlog = ({ stories, backlogShown }) => {

  const hasStories = stories && !!stories.size;

  const backlogClasses = classnames('backlog', {
    'backlog-active': backlogShown // if true, show menu also in small screens (menu toggle)
  });

  return (
    <div className={backlogClasses}>

      <StoryAddForm />

      {
        hasStories &&
        <Stories />
      }

      {
        !hasStories &&
        <div className='story-hint'>You don't have any stories in your estimation backlog...</div>
      }

    </div>
  );
};

Backlog.propTypes = {
  stories: React.PropTypes.instanceOf(Immutable.Map),
  backlogShown: React.PropTypes.bool
};


export default connect(
  state => ({
    stories: state.get('stories'),
    backlogShown: state.get('backlogShown')
  })
)(Backlog);
