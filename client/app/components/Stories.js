import React from 'react';
import Story from './Story';

const Stories = ({ stories, selectedStory, actions }) => (
  <div className='stories'>
    { stories.toList().map(story => <Story key={story.get('id')} story={story} selectedStory={selectedStory}
                                           onSelect={actions.selectStory}/>) }
  </div>
);


export default Stories;
