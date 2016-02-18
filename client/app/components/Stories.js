import React from 'react';
import classnames from 'classnames';
import Anchorify from 'react-anchorify-text';

const Story = ({story, selectedStory, onSelect}) => {
  var classes = classnames('story', {'story-selected': selectedStory === story.get('id')});
  return (
    <div className={classes} onClick={onSelect.bind(undefined, story.get('id'))}>
      <h4>
        {story.get('title')}
      </h4>
      <div>
        <Anchorify text={story.get('description')}/>
      </div>
    </div>
  );
};

const Stories = ({ stories, selectedStory, actions }) => (
  <div className='stories'>
    { stories.toList().map(story => <Story key={story.get('id')} story={story} selectedStory={selectedStory}
                                           onSelect={actions.selectStory}/>) }
  </div>
);


export default Stories;
