import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Stories from './Stories';
import StoryAddForm from './StoryAddForm';

const Backlog = ({ stories, menuShown }) => {

  const hasStories = stories && !!stories.size;

  const backlogClasses = classnames('backlog', {
    'backlog-active': menuShown // if true, show menu also in small screens (menu toggle)
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


export default connect(
  state => ({
    stories: state.get('stories'),
    menuShown: state.get('menuShown')
  })
)(Backlog);
