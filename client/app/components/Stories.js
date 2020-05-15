import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Story from './Story';
import StoryEditForm from './StoryEditForm';

/**
 * A list of stories (in the backlog)
 */
const Stories = ({stories}) => {
  const storyList = Object.values(stories);
  storyList.sort((story) => story.createdAt);

  return (
    <div className="stories">
      {storyList.map((story) => (
        <StoriesItem key={story.id} story={story} />
      ))}
    </div>
  );
};

Stories.propTypes = {
  stories: PropTypes.object
};

export default connect((state) => ({
  stories: state.stories
}))(Stories);

/**
 * if story is in edit mode, display form.
 */
const StoriesItem = ({story}) => {
  return story.editMode ? <StoryEditForm story={story} /> : <Story story={story} />;
};

StoriesItem.propTypes = {
  story: PropTypes.object
};
