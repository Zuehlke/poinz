import React from 'react';
import { connect } from 'react-redux';

import Story from './Story';

const Stories = ({ stories }) => (
  <div className='stories'>
    { stories.toList().map(story => (
      <Story key={story.get('id')}
             story={story}/>
    )) }
  </div>
);


export default connect(
  state => ({
    stories: state.get('stories')
  })
)(Stories);
