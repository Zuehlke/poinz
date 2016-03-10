import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import Story from './Story';
import StoryEditForm from './StoryEditForm';

const Stories = ({ stories }) => (
  <div className='stories'>
    { stories.toList().map(story => {
      if (story.get('editMode')) {
        return (
          <StoryEditForm key={story.get('id')}
                 story={story}/>
        );
      } else {
        return (
          <Story key={story.get('id')}
                 story={story}/>
        );
      }
    }) }
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
