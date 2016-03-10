import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import Story from './Story';
import StoryEditForm from './StoryEditForm';

/**
 * A list of stories (in the backlog)
 */
const Stories = ({ stories }) => (
  <div className='stories'>
    { stories.toList().map(story => <StoriesItem key={story.get('id')} story={story}/>) }
  </div>
);

Stories.propTypes = {
  stories: React.PropTypes.instanceOf(Immutable.Map)
};

export default connect(
  state => ({
    stories: state.get('stories')
  })
)(Stories);


/**
 * if story is in edit mode, display form.
 */
const StoriesItem = ({story}) => {
  return (story.get('editMode'))
    ? <StoryEditForm story={story}/>
    : <Story story={story}/>;
};

StoriesItem.propTypes = {
  story: React.PropTypes.instanceOf(Immutable.Map)
};

